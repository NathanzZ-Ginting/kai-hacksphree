import { success } from "zod";
import { Schedule } from "../../../common/interface/schedules-interface.ts";
import {
  createSchedule,
  getAllSchedules,
  getScheduleByUuid,
} from "../../../common/repositories/schedules-repository.ts";

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

export {fetchSchedule, fetchScheduleByUuid, addSchedule}