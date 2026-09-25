import { db } from "@/prisma/db";
import { SignupInput } from "@/schema/auth-schema";

export class UserRepository {
  async findById(id: string) {
    return await db.orm.public.User
      .select("id", "name", "email", "createdAt", "role", "emailVerified")
      .first({ id });
  }

  async findByEmail(email: string) {
    return await db.orm.public.User.where({ email }).first();
  }

  async create(data: SignupInput) {
    return await db.orm.public.User
      .select("id", "name", "email", "createdAt", "role", "emailVerified")
      .create(data);
  }

  async markEmailVerified(userId: string) {
    return db.orm.public.User
      .where({ id: userId })
      .select("id", "email", "emailVerified")
      .update({ emailVerified: new Date().toISOString() });
  }
}