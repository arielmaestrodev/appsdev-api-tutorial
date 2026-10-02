import { db } from "@/prisma/db";
import type { CreateRecipeInput, UpdateRecipeInput } from "@/schema/recipe-schema";

export class RecipeRepository {
  async findAll(userId?: string) {
    const recipes = db.orm.public.Recipe;
    return userId ? recipes.where({ userId }).all() : recipes.all();
  }

  async findById(id: string, userId?: string) {
    return db.orm.public.Recipe.first(userId ? { id, userId } : { id });
  }

  async create(data: CreateRecipeInput, userId: string) {
    return db.orm.public.Recipe.create({ ...data, userId });
  }

  async update(id: string, data: UpdateRecipeInput, userId?: string) {
    return db.orm.public.Recipe.where(userId ? { id, userId } : { id }).update(data);
  }

  async delete(id: string, userId?: string) {
    return db.orm.public.Recipe.where(userId ? { id, userId } : { id }).delete();
  }
}
