import { Hono } from "hono";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response.ts";
import { RegisterService } from "../services/register-service.ts";
import { RegisterValidation } from "../validation/register-validation.ts";
import z from "zod";
import path from "path";

const RegisterController = new Hono();

RegisterController.post("/", async (c) => {
  try {
    const { name, email, password, age, phoneNumber } = await c.req.json();

    if (!name || !email || !password || !age || !phoneNumber) {
      return c.json(ErrorsRes("Isi lengkap data diri anda!"), 400);
    }

    try {
      await RegisterValidation.parse({
        name: name,
        email: email,
        password: password,
        age: age,
        phoneNumber: phoneNumber,
      });
    } catch (error) {
      return c.json(
        ErrorsRes(
          "Data tidak valid!",
          (error as z.ZodError).issues.map((e) => ({
            path: e.path[0],
            message: e.message,
          }))
        ), 400
      );
    }

    const result = await RegisterService(name, email, password, age, phoneNumber)

    if(!result.success) {
        return c.json(ErrorsRes(result.message), 500)
    }

    return c.json(SuccessRes(result.message), 201)
        
  } catch (error) {
    console.error("Register controller error:", error);
    return c.json(ErrorsRes("Terjadi kesalahan pada server"), 500);
  }
});

export default RegisterController;
