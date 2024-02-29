export interface LoginParams {
  username: string,
  password: string
}

export interface LoginResponseData {
  accessToken: string,
  refreshToken: string,
  userId: string,
  avatarUrl?: string
}
