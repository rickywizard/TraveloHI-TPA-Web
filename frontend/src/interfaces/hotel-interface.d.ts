import { IUser } from "./user-interface";

export interface IHotel {
  id: number;
  name: string;
  hotel_images: IHoteLImage[];
  description: string;
  address: string;
  star: string;
  starting_price: number;
  rooms: IRoom[];
  reviews: IReview[];
  facilities: IFacility[];
}

export interface IHoteLImage {
  id: number;
  hotel_id: number;
  image_url: string;
}

export interface IRoom {
  id: number;
  hotel_id: number;
  room_type: string;
  price: number;
  total: number;
  room_images: IRoomImage[];
  facilities: IFacility[];
}

export interface IRoomImage {
  id: number;
  room_id: number;
  image_url: string;
}

export interface IReview {
  id: number;
  user: IUser;
  rating: number;
  comment_text: string;
}

export interface IFacility {
  id: number;
  name: string;
}
