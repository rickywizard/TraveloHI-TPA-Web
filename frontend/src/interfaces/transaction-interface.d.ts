import { IRoom } from "./hotel-interface";

export interface IHotelTransaction {
  id: number;
  room_id: number;
  room: IRoom;
  check_in: string;
  check_out: string;
  total_price: number;
  is_expired: boolean;
  is_paid: boolean;
}