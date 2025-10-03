// Schedule interfaces
export interface Schedule {
  uuid: string;
  trainName?: string;
  originStationName?: string;
  destinationStationName?: string;
  departureTime: Date;
  arrivalTime: Date;
  createdAt: Date;
  updatedAt: Date;
}