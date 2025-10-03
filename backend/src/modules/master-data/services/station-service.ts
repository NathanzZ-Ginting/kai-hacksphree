import { Station } from "../../../common/interface/stations-interface";
import { createStation, getAllStations, getStationByUuid } from "../../../common/repositories/stations-repository";

interface stationResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchStation = async (): Promise<stationResult> => {
  try {
    const collection = await getAllStations();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as stationResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as Station[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchStationByUuid = async (uuid: string): Promise<stationResult> => {
  try {
    const schedule = await getStationByUuid(uuid);

    if (!schedule) {
      return {
        success: false,
        message: `Ticket dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Ticket ditemukan!",
      data: schedule as Station,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const addStation = async (station: Station): Promise<stationResult> => {
  try {
    const newStation = await createStation(station);

    return {
      success: true,
      message: "Ticket berhasil dibuat!",
      data: newStation,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export {fetchStation, fetchStationByUuid, addStation}