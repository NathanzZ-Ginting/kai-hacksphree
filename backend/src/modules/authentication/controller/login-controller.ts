import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { LoginService } from "../services/login-service.ts";
import { sign } from "hono/jwt";
import { getUserByEmail, updateUser } from "../../../common/repositories/users-repository.ts";
import { LoginValidation } from "../validation/login-validation.ts";
import z from "zod";
import path from "path";

const LoginController = new Hono();

LoginController.post("/", async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json(ErrorsRes("Silahkan isi email dan password!"), 400);
  }

  try{
    await LoginValidation.parse({
        email: email, password: password
    })
  }catch(error) {
    return c.json(ErrorsRes("Data tidak valid!", (error as z.ZodError).issues.map((e) => ({
        path: e.path[0],
        message: e.message
    }))),400)
  }

  const result = await LoginService(email, password);

  if (!process.env.X_KEY) {
    return c.json(ErrorsRes("Token JWT tidak dapat dibuat!"), 500);
  }

  if (!result.success) {
    return c.json(ErrorsRes(result.message), 500);
  }

  const user = await getUserByEmail(email);
  const exp = Math.floor(Date.now() / 1000) + 60 * 50;

  const token = await sign(
    {
      uuid: user.uuid,
      exp,
    },
    process.env.X_KEY
  );

  await updateUser(user.uuid, {...user, token: token})

  return c.json(SuccessRes(result.message, {user: result.data,token: token}))
});

export default LoginController