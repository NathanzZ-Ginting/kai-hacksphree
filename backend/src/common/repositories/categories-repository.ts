import { eq, like, and, asc } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { categories } from "../../db/schema.ts";
import { Category } from "../interface/categories-interface.ts";

// Get all categories
export const getAllCategories = async (): Promise<Category[]> => {
  const collection = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name));
  return collection as Category[];
};

// Get category by UUID
export const getCategoryByUuid = async (
  uuid: string
): Promise<Category | null> => {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.uuid, uuid))
    .limit(1);
  return (category[0] as Category) || null;
};

// Get category by name
export const getCategoryByName = async (
  name: string
): Promise<Category | null> => {
  const category = await db
    .select()
    .from(categories)
    .where(eq(categories.name, name))
    .limit(1);
  return (category[0] as Category) || null;
};

// Search categories by name
export const searchCategoriesByName = async (
  name: string
): Promise<Category[]> => {
  const collection = await db
    .select()
    .from(categories)
    .where(like(categories.name, `%${name}%`))
    .orderBy(asc(categories.name));
  return collection as Category[];
};

// Search categories by description
export const searchCategoriesByDescription = async (
  description: string
): Promise<Category[]> => {
  const collection = await db
    .select()
    .from(categories)
    .where(like(categories.description, `%${description}%`))
    .orderBy(asc(categories.name));
  return collection as Category[];
};

// Get categories by criteria
export const getCategoriesByCriteria = async (criteria: {
  name?: string;
  description?: string;
}): Promise<Category[]> => {
  const conditions = [];

  if (criteria.name) {
    conditions.push(like(categories.name, `%${criteria.name}%`));
  }

  if (criteria.description) {
    conditions.push(like(categories.description, `%${criteria.description}%`));
  }

  let collection;
  if (conditions.length > 0) {
    collection = await db
      .select()
      .from(categories)
      .where(and(...conditions))
      .orderBy(asc(categories.name));
  } else {
    collection = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name));
  }

  return collection as Category[];
};

// Create new category
export const createCategory = async (
  newCategory: Omit<Category, "uuid" | "createdAt" | "updatedAt">
): Promise<Category> => {
  const createdCategory = await db
    .insert(categories)
    .values(newCategory as any)
    .returning();
  return createdCategory[0] as Category;
};

// Update category
export const updateCategory = async (
  uuid: string,
  categoryData: Partial<Category>
): Promise<Category | null> => {
  const updatedCategory = await db
    .update(categories)
    .set(categoryData)
    .where(eq(categories.uuid, uuid))
    .returning();
  return (updatedCategory[0] as Category) || null;
};

// Delete category
export const deleteCategory = async (uuid: string): Promise<boolean> => {
  const deletedCategory = await db
    .delete(categories)
    .where(eq(categories.uuid, uuid))
    .returning();
  return deletedCategory.length > 0;
};

// Get categories with pagination
export const getCategoriesWithPagination = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Category[]> => {
  const offset = (page - 1) * pageSize;
  const collection = await db
    .select()
    .from(categories)
    .orderBy(asc(categories.name))
    .limit(pageSize)
    .offset(offset);
  return collection as Category[];
};