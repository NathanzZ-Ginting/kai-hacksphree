import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { ErrorsRes, SuccessRes } from "../../../common/utils/api-response";
import { getTransactionHistory } from "../services/transaction-history-service";

const TransactionHistoryController = new Hono();

// Middleware untuk autentikasi JWT
TransactionHistoryController.use("*", async (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.X_KEY || "defaultsecret",
  });
  return jwtMiddleware(c, next);
});

TransactionHistoryController.get("/", async (c) => {
  try {
    const payload = c.get("jwtPayload");
    const userId = payload?.uuid;

    if (!userId) {
      return c.json(ErrorsRes("User ID tidak ditemukan"), 401);
    }

    const result = await getTransactionHistory(userId);

    if (!result.success) {
      return c.json(ErrorsRes(result.message), 500);
    }

    return c.json(SuccessRes(result.message, result.data));
  } catch (error) {
    console.error("Error in transaction history controller:", error);
    return c.json(ErrorsRes("Terjadi kesalahan server"), 500);
  }
});

export default TransactionHistoryController;
