import { getUserByEmail } from "../../../common/repositories/users-repository.ts"
import bcrypt from 'bcrypt'

interface LoginResult {
    success: boolean,
    message: string
}

export const LoginService = async (email: string, password: string): Promise<LoginResult> => {
    const user = await getUserByEmail(email);

    if(!user) {
        return {
            success: false,
            message: "Email tidak ditemukan!"
        } as LoginResult
    }

    var passValidate = await bcrypt.compare(password, user.password)

    if(!passValidate){
         return {
           success: false,
           message: "Password tidak ditemukan!",
         } as LoginResult;
    }

    return {
        success: true,
        message: "Login berhasil " + user.name
    }
}