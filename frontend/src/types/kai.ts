export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface TrainRoute {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: string;
  type: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Station {
  uuid: string;
  name: string;
  stationCode: string;
  locationId: string;
  createdAt: string;
  updatedAt: string;
  lat?: number;
  lng?: number;
  city?: string;
}
