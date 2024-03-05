import { IFlight } from "./flight-interface";
import { IRoom } from "./hotel-interface";

export interface IHotelTransaction {
  id: number;
  room_id: number;
  room: IRoom;
  check_in: string;
  check_out: string;
  total_price: number;
}

export interface IFlightTransaction {
  id: number;
  flight_id: number;
  flight: IFlight;
  seat_number: number;
  add_luggage: boolean;
  total_price: number;
}