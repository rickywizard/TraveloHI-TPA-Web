export interface IAirline {
  id: number
  name: string
  airline_image_url: string
  flights: IFlight[]
}

export interface IFlight {
  id: number
  airline_id: number
  airline: IAirline
  flight_number: string
  total_seat: number
  flight_date: string
  price: number
  departure_datetime: string
  arrival_datetime: string
  departure_airport: string
  arrival_airport: string
  duration: number
  transits: ITransit[]
  booked_seats: IBookedSeat[]
}

interface ITransit {
  id: number
  flight_id: string
  transit_airport: string
  arrival_transit_time: string
}

interface IBookedSeat {
  id: number
  seat_number: number
}