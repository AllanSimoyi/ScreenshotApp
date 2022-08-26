import { CurrentUser } from "../components/CurrentUserProvider";
import { User } from "./users";
import { CreateMessage } from "./validations";

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

export function createOptimisticMessage (newMessage: CreateMessage, currentUser: CurrentUser) {
  const message: Message = {
    id: 1,
    senderId: newMessage.userId,
    sender: {
      id: currentUser.userId,
      username: currentUser.username,
      role: "Normal",
      phoneNumber: currentUser.phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    receiverId: newMessage.receiverId,
    receiver: {
      id: newMessage.receiverId,
      username: "ZIMCODD",
      role: "Organization",
      phoneNumber: "+263738083125",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    content: newMessage.content,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return message;
}