export interface User {
  id: number;
  username: string;
  role: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileDetails {
  userId: number;
  username: string;
  phoneNumber: string;
}