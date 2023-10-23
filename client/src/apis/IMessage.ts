export type IMessage = {
  conversationId?: string;
  sender: string;
  receiver: string;
  content: string;
  date: Date;
};
