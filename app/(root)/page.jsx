import { currentUser } from "@/app/modules/authentication/actions";
import ChatMessageView from "@/app/modules/chat/components/chat-message-view";
import React from "react";

const Home = async () => {
  const user = await currentUser();
  return (
    <>
      <ChatMessageView user={user} />
    </>
  );
};

export default Home;
