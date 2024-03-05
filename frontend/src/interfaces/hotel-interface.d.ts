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
  average_clean_rating: number;
  average_comfort_rating: number;
  average_location_rating: number;
  average_service_rating: number;
  average_total_rating: number;
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
  clean_rating: number;
  comfort_rating: number;
  location_rating: number;
  service_rating: number;
  comment_text: string;
}

export interface IFacility {
  id: number;
  name: string;
}
