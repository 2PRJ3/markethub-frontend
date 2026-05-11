export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: number | string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  role: string;
  university: string;
  study_sector: string
}

export interface UserCreate{
  first_name: string
  last_name: string
  email: string
  password: string
}
