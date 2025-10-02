import z from "zod";

export const LoginValidation = z.object({
    email: z.string().email("Masukan email yang valid!"),
    password: z.string().min(6, "Mininal 6 karakter!")
})