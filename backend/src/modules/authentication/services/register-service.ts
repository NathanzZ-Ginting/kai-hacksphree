import {
  getUserByEmail,
  createUser,
} from "../../../common/repositories/users-repository.ts";
import { User } from "../../../common/interface/users-interface.ts";
import bcrypt from "bcrypt";

interface RegisterResult {
  success: boolean;
  message: string;
}

export const RegisterService = async (
  name: string,
  email: string,
  password: string,
  age?: number,
  phoneNumber?: string
): Promise<RegisterResult> => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return {
        success: false,
        message: "Email sudah terdaftar!",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUserData = {
      name: name,
      email: email,
      password: hashedPassword,
      age: age,
      phoneNumber: phoneNumber,
    };

    await createUser(newUserData as User);

    return {
      success: true,
      message: "Registrasi berhasil!",
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat registrasi!",
    };
  }
};
