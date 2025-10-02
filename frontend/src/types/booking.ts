export interface Station {
  id: string;
  name: string;
  city: string;
  code: string;
  type: "STATION" | "TERMINAL";
}

export interface Train {
  id: string;
  name: string;
  number: string;
  class: "EKSEKUTIF" | "BISNIS" | "EKONOMI" | "PREMIUM";
  subclass: string;
  facilities: string[];
  capacity: number;
}

export interface Schedule {
  id: string;
  train: Train;
  departure: {
    station: Station;
    time: string;
    date: string;
  };
  arrival: {
    station: Station;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  availableSeats: number;
}

export interface Passenger {
  id?: string;
  type: "ADULT" | "CHILD" | "INFANT";
  name: string;
  identityNumber: string;
  seat?: string;
  price: number;
}

export interface BookingData {
  from: Station;
  to: Station;
  departureDate: string;
  returnDate?: string;
  schedule: Schedule;
  passengers: Passenger[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod?: string;
  totalAmount: number;
}
