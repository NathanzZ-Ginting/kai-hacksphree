import React, { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";
import type { Station, Schedule, Passenger, BookingData } from "../types/booking";

interface BookingState {
  step: "search" | "select" | "passenger" | "payment" | "confirmation";
  searchData: {
    from: Station | null;
    to: Station | null;
    departureDate: string;
    returnDate: string;
    isRoundTrip: boolean;
    passengerCount: {
      adult: number;
      child: number;
      infant: number;
    };
  };
  availableSchedules: Schedule[];
  selectedSchedule: Schedule | null;
  passengers: Passenger[];
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

type BookingAction =
  | { type: "SET_STEP"; payload: BookingState["step"] }
  | { type: "SET_SEARCH_DATA"; payload: Partial<BookingState["searchData"]> }
  | { type: "SET_SCHEDULES"; payload: Schedule[] }
  | { type: "SELECT_SCHEDULE"; payload: Schedule }
  | { type: "ADD_PASSENGER"; payload: Passenger }
  | {
      type: "UPDATE_PASSENGER";
      payload: { index: number; data: Partial<Passenger> };
    }
  | { type: "SET_CONTACT_INFO"; payload: Partial<BookingState["contactInfo"]> }
  | { type: "RESET_BOOKING" };

const initialState: BookingState = {
  step: "search",
  searchData: {
    from: null,
    to: null,
    departureDate: new Date().toISOString().split("T")[0],
    returnDate: "",
    isRoundTrip: false,
    passengerCount: {
      adult: 1,
      child: 0,
      infant: 0,
    },
  },
  availableSchedules: [],
  selectedSchedule: null,
  passengers: [],
  contactInfo: {
    name: "",
    email: "",
    phone: "",
  },
};

const bookingReducer = (
  state: BookingState,
  action: BookingAction
): BookingState => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload };

    case "SET_SEARCH_DATA":
      return {
        ...state,
        searchData: { ...state.searchData, ...action.payload },
      };

    case "SET_SCHEDULES":
      return { ...state, availableSchedules: action.payload };

    case "SELECT_SCHEDULE":
      return { ...state, selectedSchedule: action.payload };

    case "ADD_PASSENGER":
      return {
        ...state,
        passengers: [...state.passengers, action.payload],
      };

    case "UPDATE_PASSENGER":
      const updatedPassengers = [...state.passengers];
      updatedPassengers[action.payload.index] = {
        ...updatedPassengers[action.payload.index],
        ...action.payload.data,
      };
      return { ...state, passengers: updatedPassengers };

    case "SET_CONTACT_INFO":
      return {
        ...state,
        contactInfo: { ...state.contactInfo, ...action.payload },
      };

    case "RESET_BOOKING":
      return initialState;

    default:
      return state;
  }
};

const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
