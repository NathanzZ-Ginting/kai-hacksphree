import { db } from "../index.ts";
import { trains } from "../schema/trains.ts";
import { categories } from "../schema/categories.ts";

export async function seedTrains() {
  // Get category UUIDs first
  const allCategories = await db.select().from(categories);

  const trainData = [
    {
      categoryId: allCategories.find((cat) => cat.name === "Eksekutif")?.uuid,
      trainCode: "ARGO_BROMO",
      name: "Argo Bromo Anggrek",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Eksekutif")?.uuid,
      trainCode: "ARGO_LAWU",
      name: "Argo Lawu",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Bisnis")?.uuid,
      trainCode: "TURANGGA",
      name: "Turangga",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Ekonomi")?.uuid,
      trainCode: "BENGAWAN",
      name: "Bengawan",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Ekonomi")?.uuid,
      trainCode: "GAYA_BARU_MLT_SEL",
      name: "Gaya Baru Malam Selatan",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Bisnis")?.uuid,
      trainCode: "HARINA",
      name: "Harina",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Priority")?.uuid,
      trainCode: "GAJAYANA",
      name: "Gajayana",
    },
    {
      categoryId: allCategories.find((cat) => cat.name === "Luxury")?.uuid,
      trainCode: "ARGO_PARAHYANGAN",
      name: "Argo Parahyangan",
    },
  ];

  await db.insert(trains).values(trainData.filter((t) => t.categoryId));
}
