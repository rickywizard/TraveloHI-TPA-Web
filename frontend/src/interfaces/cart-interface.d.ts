import { IRoom } from "./hotel-interface";

interface IHotelCart {
  id: number;
  room_id: number;
  room: IRoom;
  check_in: string;
  check_out: string;
  total_price: number;
}

export interface ICart {
  cart_total_price: number;
  hotel_cart: IHotelCart[];
}