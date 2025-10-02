// Schedule interfaces
export interface Schedule {
  uuid: string;
  trainId?: string;
  originStationId?: string;
  destinationStationId?: string;
  departureTime: Date;
  arrivalTime: Date;
  createdAt: Date;
  updatedAt: Date;
}