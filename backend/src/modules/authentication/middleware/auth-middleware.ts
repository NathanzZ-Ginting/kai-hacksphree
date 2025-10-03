import { Context, Next, MiddlewareHandler } from "hono";
import { verify } from "hono/jwt";
import { ErrorsRes } from "../../../common/utils/api-response";
import { getUserByUuid } from "../../../common/repositories/users-repository";

export interface AuthPayload {
  uuid: string;
  exp: number;
}

// Middleware untuk verifikasi JWT token
export const authMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader) {
      return c.json(ErrorsRes("Token tidak ditemukan"), 401);
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return c.json(ErrorsRes("Format token tidak valid"), 401);
    }

    if (!process.env.X_KEY) {
      return c.json(ErrorsRes("JWT key tidak ditemukan"), 500);
    }

    // Verify JWT token
    const payload = (await verify(
      token,
      process.env.X_KEY
    )) as unknown as AuthPayload;

    if (!payload || !payload.uuid) {
      return c.json(ErrorsRes("Token tidak valid"), 401);
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return c.json(ErrorsRes("Token sudah expired"), 401);
    }

    // Get user data
    const user = await getUserByUuid(payload.uuid);

    if (!user) {
      return c.json(ErrorsRes("User tidak ditemukan"), 401);
    }

    // Verify if the token matches the user's current token
    if (user.token !== token) {
      return c.json(ErrorsRes("Token tidak valid atau sudah logout"), 401);
    }

    // Set user data in context for use in controllers
    c.set("user", user);
    c.set("token", token);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json(ErrorsRes("Token tidak valid"), 401);
  }
};

// Middleware khusus untuk mendapatkan user (optional auth)
export const optionalAuthMiddleware: MiddlewareHandler = async (
  c: Context,
  next: Next
) => {
  try {
    const authHeader = c.req.header("Authorization");

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      if (token && process.env.X_KEY) {
        const payload = (await verify(
          token,
          process.env.X_KEY
        )) as unknown as AuthPayload;

        if (payload && payload.uuid) {
          const user = await getUserByUuid(payload.uuid);
          if (user && user.token === token) {
            c.set("user", user);
            c.set("token", token);
          }
        }
      }
    }

    await next();
  } catch (error) {
    // Jika optional auth gagal, lanjutkan tanpa user
    await next();
  }
};
