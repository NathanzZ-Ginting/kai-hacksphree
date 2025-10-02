import { z } from "zod";

export const RegisterValidation = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(255, "Nama maksimal 255 karakter"),

  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email maksimal 255 karakter"),

  password: z
    .string()
    .min(6, "Password minimal 6 karakter")
    .max(255, "Password maksimal 255 karakter"),

  age: z
    .number()
    .min(1, "Umur minimal 1 tahun")
    .max(150, "Umur maksimal 150 tahun")
    .optional(),

  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(20, "Nomor telepon maksimal 20 digit")
    .regex(
      /^[0-9+\-\s]+$/,
      "Nomor telepon hanya boleh berisi angka, +, -, dan spasi"
    )
    .optional(),
});

export type RegisterInput = z.infer<typeof RegisterValidation>;
