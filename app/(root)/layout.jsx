import { currentUser } from "@/app/modules/authentication/actions";
import { getAllChats } from "@/app/modules/chat/actions";
import { ChatSidebar } from "@/app/modules/chat/components/chat-sidebar";
import Header from "@/app/modules/chat/components/header";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

const Layout = async ({ children }) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: chats } = await getAllChats();

  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar user={user} chats={chats || []} />
      <main className="flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Layout;
