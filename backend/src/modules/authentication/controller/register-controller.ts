import { Hono } from "hono";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SuccessRes, ErrorsRes } from "../../../common/utils/api-response";
import { getUserByEmail, createUser, updateUser, getUserByUuid } from "../../../common/repositories/users-repository";
import { verifyCaptcha } from "../../../common/utils/verifyCaptcha";

const RegisterController = new Hono();

RegisterController.post("/", async (c) => {
  try {
    // Ambil data dari body
    const body = await c.req.json();
    const { name, email, password, phoneNumber, captchaToken } = body;

    console.log("Request body received for captcha verification");

    // Verifikasi CAPTCHA
    const captchaIsValid = await verifyCaptcha(captchaToken);
    if (!captchaIsValid) {
      return c.json(ErrorsRes("Verifikasi CAPTCHA gagal"), 400);
    }

    console.log("Captcha validation result:", captchaIsValid);

    // Validasi input sederhana
    if (!name || !email || !password) {
      return c.json(ErrorsRes("Nama, email, dan password wajib diisi"), 400);
    }

    // Validasi email format sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json(ErrorsRes("Format email tidak valid"), 400);
    }

    // Validasi password minimal 6 karakter
    if (password.length < 6) {
      return c.json(ErrorsRes("Password minimal 6 karakter"), 400);
    }

    // Cek apakah email sudah ada
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return c.json(ErrorsRes("Email sudah terdaftar"), 409);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate age (random between 20-50 for demo)
    const age = Math.floor(Math.random() * 31) + 20;

    // Simpan user baru
    const newUser = await createUser({
      name: name,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber || "",
      age: age,
    } as any);

    // Generate JWT token
    const secretKey = process.env.JWT_SECRET || "your-secret-key";
    const token = jwt.sign(
      { 
        uuid: newUser.uuid, 
        email: newUser.email,
        name: newUser.name 
      },
      secretKey,
      { expiresIn: "24h" }
    );

    // Update user token
    await updateUser(newUser.uuid, { ...newUser, token: token });
    const updatedUser = await getUserByUuid(newUser.uuid);

    return c.json(SuccessRes(
      "Registrasi berhasil!", 
      {
        user: updatedUser,
        token: token,
      }
    ), 201);

  } catch (error) {
    console.error("Register controller error:", error);
    return c.json(ErrorsRes("Terjadi kesalahan pada server"), 500);
  }
});

export default RegisterController;
