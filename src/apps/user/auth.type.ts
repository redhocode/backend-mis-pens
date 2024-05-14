export default interface UserType {
  id: string
  username: string
  password: string
  role: string | null
  createdAt: Date
  updatedAt: Date
}
