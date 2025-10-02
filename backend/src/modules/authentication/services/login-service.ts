import { getUserByEmail } from "../../../common/repositories/users-repository.ts"
import bcrypt from 'bcrypt'

interface serviceResult {
    success: boolean,
    message: string
}

export const LoginService = async (email: string, password: string): Promise<serviceResult> => {
    const user = await getUserByEmail(email);

    if(!user && )
}