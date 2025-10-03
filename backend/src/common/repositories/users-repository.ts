import { eq } from "drizzle-orm";
import { db } from "../../db/index";
import { users } from "../../db/schema";
import { User } from "../interface/users-interface";

export const getAllUsers = async (): Promise<User[]> => {
  var collection = await db.select().from(users);
  return collection as User[]
};

export const getUserByUuid = async (uuid: string): Promise<User> => {
  var user = await db.select().from(users).where(eq(users.uuid, uuid)).limit(1);
  return user[0] as User
};

export const getUserByEmail = async (email: string): Promise<User> => {
     var user = await db.select().from(users).where(eq(users.email, email)).limit(1);
     return user[0] as User
}

export const createUser = async (newUser: User): Promise<User> => {
  var NewUser = await db.insert(users).values(newUser).returning()
  return NewUser[0] as User
}

export const updateUser = async (uuid: string, user: User)=> {
  var updatedUser = await db.update(users).set(user).where(eq(users.uuid, uuid)).returning()
  return updatedUser[0]
}