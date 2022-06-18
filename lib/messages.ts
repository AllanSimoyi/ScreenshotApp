import { User } from "./users";

export interface Message {
  id: number;

  senderId: number;
  sender: User;

  receiverId: number;
  receiver: User;

  content: string;

  createdAt: Date;
  updatedAt: Date;
}