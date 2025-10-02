import { Category } from "../../../common/interface/categories-interface.ts";
import { Location } from "../../../common/interface/locations-interface.ts";
import {
  createCategory,
  getAllCategories,
  getCategoryByUuid,
} from "../../../common/repositories/categories-repository.ts";
import {
  createLocation,
  getAllLocations,
  getLocationByCity,
  getLocationByUuid,
} from "../../../common/repositories/locations-repository.ts";

interface locationResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchLocation = async (): Promise<locationResult> => {
  try {
    const collection = await getAllLocations();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as locationResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as Location[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchLocationByUuid = async (uuid: string): Promise<locationResult> => {
  try {
    const loc = await getLocationByUuid(uuid);

    if (!loc) {
      return {
        success: false,
        message: `Location dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Category ditemukan!",
      data: loc as Location,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchLocationByCity = async (city: string): Promise<locationResult> => {
  try {
    const loc = await getLocationByCity(city);

    if (!loc) {
      return {
        success: false,
        message: `Location dengan city ${city} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "City ditemukan!",
      data: loc as Location,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const addLocation = async (loc: Location): Promise<locationResult> => {
  try {
    const newLoc = await createLocation(loc);

    return {
      success: true,
      message: "Location berhasil dibuat!",
      data: newLoc,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export { fetchLocation, fetchLocationByUuid, fetchLocationByCity,addLocation };
