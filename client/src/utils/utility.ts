import { IMessage } from "@/types/types";


const CountUnreadMessages = (messages: IMessage[], userId: string) => {
    return messages.filter((message) => message.senderId === userId && message.status !== 'READ').length;
}

export { CountUnreadMessages };