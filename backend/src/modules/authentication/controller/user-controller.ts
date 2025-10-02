import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { authMiddleware } from "../middleware/auth-middleware.ts";
import {
  getUserByUuid,
  updateUser,
} from "../../../common/repositories/users-repository.ts";
import { User } from "../../../common/interface/users-interface.ts";

const UserController = new Hono();

// GET /profile - Mendapatkan data user yang sedang login
UserController.get("/profile", authMiddleware, async (c) => {
  try {
    // User data sudah tersedia dari middleware
    const user = (c as any).get("user") as User;

    if (!user) {
      return c.json(ErrorsRes("User tidak ditemukan"), 404);
    }

    // Remove sensitive data before sending response
    const { password, token, ...safeUserData } = user;

    return c.json(SuccessRes("Data user berhasil diambil", safeUserData), 200);
  } catch (error) {
    console.error("Get profile error:", error);
    return c.json(ErrorsRes("Gagal mengambil data user"), 500);
  }
});

// PUT /profile - Update profile user yang sedang login
UserController.put("/profile", authMiddleware, async (c) => {
  try {
    const user = (c as any).get("user") as User;

    if (!user) {
      return c.json(ErrorsRes("User tidak ditemukan"), 404);
    }

    const { name, email, phone } = await c.req.json();

    // Validate input
    if (!name && !email && !phone) {
      return c.json(ErrorsRes("Minimal satu field harus diisi"), 400);
    }

    // Prepare update data
    const updateData: any = { ...user };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;

    // Update user
    const updatedUser = await updateUser(user.uuid, updateData);

    if (!updatedUser) {
      return c.json(ErrorsRes("Gagal mengupdate profile"), 500);
    }

    // Remove sensitive data
    const { password, token, ...safeUserData } = updatedUser;

    return c.json(SuccessRes("Profile berhasil diupdate", safeUserData), 200);
  } catch (error) {
    console.error("Update profile error:", error);
    return c.json(ErrorsRes("Gagal mengupdate profile"), 500);
  }
});

// POST /logout - Logout user (clear token)
UserController.post("/logout", authMiddleware, async (c) => {
  try {
    const user = (c as any).get("user") as User;

    if (!user) {
      return c.json(ErrorsRes("User tidak ditemukan"), 404);
    }

    // Clear token from database
    await updateUser(user.uuid, { ...user, token: "" });

    return c.json(SuccessRes("Logout berhasil"), 200);
  } catch (error) {
    console.error("Logout error:", error);
    return c.json(ErrorsRes("Gagal logout"), 500);
  }
});

// GET /me - Alternative endpoint untuk mendapatkan data user
UserController.get("/me", authMiddleware, async (c) => {
  try {
    const user = (c as any).get("user") as User;

    if (!user) {
      return c.json(ErrorsRes("User tidak ditemukan"), 404);
    }

    // Remove sensitive data
    const { password, token, ...safeUserData } = user;

    return c.json(
      SuccessRes("Data user berhasil diambil", {
        user: safeUserData,
        isAuthenticated: true,
      }),
      200
    );
  } catch (error) {
    console.error("Get me error:", error);
    return c.json(ErrorsRes("Gagal mengambil data user"), 500);
  }
});

export default UserController;
