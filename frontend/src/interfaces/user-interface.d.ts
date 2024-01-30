export interface IUser {
  id: number
  first_name: string
  last_name: string
  email: string
  date_of_birth: string
  gender: string
  profile_picture_url: string
  security_question: string
  is_subscriber: boolean
  is_active: boolean
  is_admin: boolean
  points: number
}