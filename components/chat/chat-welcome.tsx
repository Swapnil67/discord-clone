import { Hash } from 'lucide-react';
import React from 'react'

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className='space-y-2 px-2 mb-4'>
      {
        type === "channel" && (
          <div className="h-[75px] w-[75px] rounded-full app-bg_light500_dark700 flex items-center justify-center">
            <Hash className='app-icon-xl text-white' />
          </div>
        )
      }
      <p className='text-xl md:text-3xl font-bold'>
        {type === "channel" ? "Welcome to #" : ""}{name}
      </p>
      <p className='app-text_light600_dark400 text-sm'>
        {type === "channel" ? `This is the start of the #${name} channel` : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  )
}

export default ChatWelcome