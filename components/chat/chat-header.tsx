import { Hash } from 'lucide-react';
import React from 'react'
import MobileToggle from '@/components/mobile-toggle';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation"  
  imageUrl?: string;
}

const ChatHeader = (props: ChatHeaderProps) => {
  const { type, name, serverId } = props;
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle serverId={serverId} />
      {
        type === "channel" && (
          <Hash className='app-icon-lg app-text_light500_dark400 mr-2' />
        )
      }
      <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
    </div>
  )
}

export default ChatHeader