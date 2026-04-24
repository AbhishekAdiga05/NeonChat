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
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar user={user} chats={chats || []} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
