import { Train } from "../../../common/interface/trains-interface.ts";
import { createTrain, getAllTrains, getTrainByUuid } from "../../../common/repositories/trains-repository.ts";

interface trainResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchTrain = async (): Promise<trainResult> => {
  try {
    const collection = await getAllTrains();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as trainResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as Train[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchTrainByUuid = async (uuid: string): Promise<trainResult> => {
  try {
    const schedule = await getTrainByUuid(uuid);

    if (!schedule) {
      return {
        success: false,
        message: `Train dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Schedule ditemukan!",
      data: schedule as Train,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const addTrain = async (train: Train): Promise<trainResult> => {
  try {
    const newTicket = await createTrain(train);

    return {
      success: true,
      message: "Schedule berhasil dibuat!",
      data: newTicket,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export {fetchTrain, fetchTrainByUuid, addTrain}