import { getUserByEmail } from "../../../common/repositories/users-repository";
import bcrypt from "bcrypt";

interface LoginResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object
}

export const LoginService = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        message: "Email tidak ditemukan!",
      } as LoginResult;
    }

    var passValidate = await bcrypt.compare(password, user.password);

    if (!passValidate) {
      return {
        success: false,
        message: "Password tidak ditemukan!",
      } as LoginResult;
    }

    return {
      success: true,
      message: "Login berhasil " + user.name,
      data: user,
    } as LoginResult;
  } catch (error) {
    return {
        success: false,
        message: "Terjadi kesalahan",
        errors: {error}
    }
  }
};
