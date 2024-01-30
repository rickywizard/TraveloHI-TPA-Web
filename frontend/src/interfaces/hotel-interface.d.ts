export interface IHotel {
  id: number;
  name: string;
  image_url: string[];
  address: string;
  star: string;
  rooms: IRoom[];
  comments: IComment[];
  facilities: IFacility[];
}

export interface IRoom {
  id: number;
  room_number: string;
  price: number;
  capacity: number;
}

export interface IComment {
  id: number;
  rating: number;
  comment_text: string;
}

export interface IFacility {
  id: number;
  name: string;
}