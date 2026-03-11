import React from "react";
import ActiveChatLoader from "@/app/modules/chat/components/active-chat-loader";
import MessageViewWithForm from "@/app/modules/chat/components/message-view-form";

const Page = async ({ params }) => {
  const { chatId } = await params;

  return (
    <>
      <ActiveChatLoader chatId={chatId} />

      <MessageViewWithForm chatId={chatId} />
    </>
  );
};

export default Page;
