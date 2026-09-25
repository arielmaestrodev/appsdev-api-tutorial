import { db } from "@/prisma/db";

type CreateTokenData = {
  userId: string;
  token: string;
  expiresAt: Date;
};

export class TokenRepository {
  async createRefreshToken(data: CreateTokenData) {
    return db.orm.public.Token.create({
      userId: data.userId,
      token: data.token,
      expiresAt: data.expiresAt.toISOString(),
      type: "REFRESH",
    });
  }

  async findActiveRefreshToken(token: string) {
    return db.orm.public.Token
      .where({ token, type: "REFRESH" })
      .where((row) => row.consumedAt.isNull())
      .where((row) => row.revokedAt.isNull())
      .first();
  }

  async consumeToken(id: string) {
    return db.orm.public.Token
      .where({ id })
      .update({ consumedAt: new Date().toISOString() });
  }

  async revokeToken(id: string) {
    return db.orm.public.Token
      .where({ id })
      .update({ revokedAt: new Date().toISOString() });
  }
}