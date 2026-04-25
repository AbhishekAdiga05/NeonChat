"use client";

import React, { useState } from 'react'
import ChatWelcomeTabs from './chat-welcome-tabs';
import ChatMessageForm from './chat-message-form';

const ChatMessageView = ({user}) => {
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
  };

  const handleMessageChange = () => {
    setSelectedMessage("");
  };

  return (
    <div className='flex flex-col items-center justify-start h-full py-12 gap-y-16 overflow-y-auto scrollbar-hide'>
        <div className="w-full flex flex-col items-center">
          <ChatWelcomeTabs
            userName={user?.name}
            onMessageSelect={handleMessageSelect}
          />
        </div>
        <div className="w-full max-w-4xl px-4 mt-auto">
          <ChatMessageForm
            initialMessage={selectedMessage}
            onMessageChange={handleMessageChange}
          />
        </div>
    </div>
  )
}

export default ChatMessageView
