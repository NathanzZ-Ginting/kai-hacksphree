import { Schedule } from "../../../common/interface/schedules-interface";
import {
  createSchedule,
  filterByOriginAndDestination,
  getAllSchedules,
  getScheduleByUuid,
} from "../../../common/repositories/schedules-repository";
import { getStationByUuid } from "../../../common/repositories/stations-repository";

interface schedulesResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchSchedule = async (): Promise<schedulesResult> => {
  try {
    const collection = await getAllSchedules();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as schedulesResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as Schedule[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchScheduleByUuid = async (uuid: string): Promise<schedulesResult> => {
  try {
    const schedule = await getScheduleByUuid(uuid);

    if (!schedule) {
      return {
        success: false,
        message: `Schedule dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Schedule ditemukan!",
      data: schedule as Schedule,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchScheduleByStation = async (
  origin: string,
  destination: string
): Promise<schedulesResult> => {
  try {
    // Validate input parameters
    if (!origin || !destination) {
      return {
        success: false,
        message: "Origin dan destination stasiun harus diisi!",
      };
    }

    const originStasiun = await getStationByUuid(origin)
    const destinationStasiun = await getStationByUuid(destination)

    // Use the new function that searches by station names
    const schedule = await filterByOriginAndDestination(origin, destination);

    if (!schedule || schedule.length < 1) {
      return {
        success: false,
        message: `Tidak ada jadwal keberangkatan dari stasiun ${originStasiun?.name} ke stasiun ${destinationStasiun?.name}`,
      };
    }

    return {
      success: true,
      message: "Jadwal ditemukan!",
      data: schedule,
    };
  } catch (error) {
    console.error("Error in fetchScheduleByStation:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mencari jadwal!",
      errors: { [0]: error },
    };
  }
};

const addSchedule = async (schedule: Schedule): Promise<schedulesResult> => {
  try {
    const newSchedule = await createSchedule(schedule);

    return {
      success: true,
      message: "Schedule berhasil dibuat!",
      data: newSchedule,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export {
  fetchSchedule,
  fetchScheduleByStation,
  fetchScheduleByUuid,
  addSchedule,
};
