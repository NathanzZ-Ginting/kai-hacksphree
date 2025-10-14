import { Hono } from "hono";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { promptValidation } from "../validations/prompt-validation";
import z from "zod";

const aiController = new Hono();

const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const AI = new GoogleGenAI({ apiKey: GEMINI_KEY });

aiController.post("/", async (c) => {
  try {
    const {prompt} = await c.req.json();

    try{
        promptValidation.parse({
            prompt: prompt
        })
    }catch(e) {
        return c.json(ErrorsRes("Gagal prompt!", (e as z.ZodError).issues.map((e) => ({
            path: e.path[0],
            message: e.message
        }))))
    }

    const res = await AI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return c.json(SuccessRes("Berhasil generate prompt!", {
        prompt: prompt,
        result: res.text
    }))
  } catch (e) {
    return c.json(ErrorsRes("Gagal generate prompt!"), 500);
  }
});

export default aiController
