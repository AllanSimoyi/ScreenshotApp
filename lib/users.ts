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

export function createEmptyUser () {
  const currentUser: User = {
    id: 0,
    username: "",
    phoneNumber: "",
    role: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return currentUser;
}