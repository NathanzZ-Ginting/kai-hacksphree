// Station interfaces
export interface Station {
  uuid: string;
  name?: string;
  stationCode?: string;
  locationId?: string;
  createdAt: Date;
  updatedAt: Date;
}