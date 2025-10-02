import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { LoginService } from "../services/login-service.ts";
import { sign } from "hono/jwt";
import { getUserByEmail } from "../../../common/repositories/users-repository.ts";

const LoginController = new Hono();

LoginController.post("/", async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json(ErrorsRes("Silahkan isi email dan password!"), 400);
  }

  const result = await LoginService(email, password);

  if (!process.env.X_KEY) {
    return c.json(ErrorsRes("Token JWT tidak dapat dibuat!"), 500);
  }

  if (!result.success) {
    return c.json(ErrorsRes(result.message), 500);
  }

  const { uuid } = await getUserByEmail(email);
  const exp = Math.floor(Date.now() / 1000) + 60 * 50;

  const token = await sign(
    {
      uuid,
      exp,
    },
    process.env.X_KEY
  );

  return c.json(SuccessRes(result.message, {token: token}))
});

export default LoginController