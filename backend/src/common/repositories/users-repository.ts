import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { users } from "../../db/schema.ts";
import { User } from "../interface/users-interface.ts";

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

export const updateUser = async (uuid: string, user: User): Promise<User> => {
  var updatedUser = await db.update(users).set({
    'name': user.name,
    'email': user.email,
    'phoneNumber': user.phoneNumber
  }).where(eq(users.uuid, uuid)).returning()

  return updatedUser[0] as User
}