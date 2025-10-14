import z from "zod";

export const promptValidation = z.object({
    prompt: z.string().min(1, "Masukan prompt terlebih dahulu!")
})