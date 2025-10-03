import { TrainSeat } from "../../../common/interface/train-seats-interface";
import { Train } from "../../../common/interface/trains-interface";
import { createTrainSeat, getAllTrainSeats, getTrainSeatByUuid } from "../../../common/repositories/train-seats-repository";
import { createTrain, getAllTrains, getTrainByUuid } from "../../../common/repositories/trains-repository";

interface seatsResult {
  success: boolean;
  message: string;
  data?: object;
  errors?: object;
}

const fetchTrainSeats = async (): Promise<seatsResult> => {
  try {
    const collection = await getAllTrainSeats();

    if (collection.length < 1) {
      return {
        success: false,
        message: "Data tidak ada!",
      } as seatsResult;
    }

    return {
      success: true,
      message: "Data ditemukan!",
      data: collection as TrainSeat[],
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const fetchTrainSeatsByUuid = async (uuid: string): Promise<seatsResult> => {
  try {
    const trainSeats = await getTrainSeatByUuid(uuid);

    if (!trainSeats) {
      return {
        success: false,
        message: `Train seats dengan uuid ${uuid} tidak ditemukan!`,
      };
    }

    return {
      success: true,
      message: "Train seats ditemukan!",
      data: trainSeats as TrainSeat,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

const addTrainSeats = async (trainSeats: TrainSeat): Promise<seatsResult> => {
  try {
    const newTrainSeat = await createTrainSeat(trainSeats);

    return {
      success: true,
      message: "Train seat berhasil dibuat!",
      data: newTrainSeat,
    };
  } catch (error) {
    return {
      success: false,
      message: "Terjadi kesalahan!",
      errors: { [0]: error },
    };
  }
};

export {fetchTrainSeats, fetchTrainSeatsByUuid, addTrainSeats}