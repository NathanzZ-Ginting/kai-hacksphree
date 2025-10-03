import { db } from "../index";
import { categories } from "../schema/categories";

export async function seedCategories() {
  const categoryData = [
    {
      name: "Ekonomi",
      description: "Kelas ekonomi dengan fasilitas standar",
    },
    {
      name: "Bisnis",
      description: "Kelas bisnis dengan fasilitas premium",
    },
    {
      name: "Eksekutif",
      description: "Kelas eksekutif dengan fasilitas mewah",
    },
    {
      name: "Priority",
      description: "Kelas prioritas dengan pelayanan terbaik",
    },
    {
      name: "Luxury",
      description: "Kelas luxury dengan fasilitas terlengkap",
    },
  ];

  await db.insert(categories).values(categoryData);
}
