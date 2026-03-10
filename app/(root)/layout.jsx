import { auth } from "@/lib/auth";
import { currentUser } from "@/app/modules/authentication/actions";
// import { getAllChats } from "@/app/modules/chat/actions";
import { ChatSidebar } from "@/app/modules/chat/components/chat-sidebar";
import Header from "@/app/modules/chat/components/header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = await currentUser();

  //   const { data: chats } = await getAllChats();

  if (!session) {
    return redirect("/sign-in");
  }
  return (
    <div className="flex h-screen overflow-hidden">
      <ChatSidebar user={user} chats={[]} />
      <main className="flex-1 overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  );
};

export default Layout;
