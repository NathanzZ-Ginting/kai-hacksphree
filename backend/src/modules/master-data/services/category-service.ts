import { Category } from "../../../common/interface/categories-interface";
import { createCategory, getAllCategories, getCategoryByUuid } from "../../../common/repositories/categories-repository";

interface categoryResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchCategory = async (): Promise<categoryResult> => {
  try {
    const collection = await getAllCategories();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as categoryResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as Category[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchCategoryByUuid = async (uuid: string): Promise<categoryResult> => {
  try {
    const category = await getCategoryByUuid(uuid);

    if (!category) {
      return {
        success: false,
        message: `Category dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Category ditemukan!",
      data: category as Category,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const addCategory = async (cat: Category): Promise<categoryResult> => {
  try {
    const newCat = await createCategory(cat);

    return {
      success: true,
      message: "Category berhasil dibuat!",
      data: newCat,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export {fetchCategory, fetchCategoryByUuid, addCategory}
