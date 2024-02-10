"use client";

import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment } from "react";
import { format } from 'date-fns';
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./chat-item";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemeberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = 'd MMM yyyy, HH:mm';

const ChatMessages = (props: ChatMessagesProps) => {
  const {
    name,
    member,
    chatId,
    type,
    apiUrl,
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
  } = props;

  const queryKey = `chat:${chatId}`;
  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  if (status == "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="app-icon-sm text-zinc-500 animate-spin my-4" />
        <p className="text-xs app-text_light500_dark400">Loading messages...</p>
      </div>
    );
  }
  if (status == "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="app-icon-sm text-zinc-500 my-4" />
        <p className="text-xs app-text_light500_dark400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col py-4 overflow-y-auto">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.items.map((message: MessageWithMemeberWithProfile) => (
                <ChatItem
                  id={message.id}
                  key={message.id}
                  socketUrl={socketUrl}
                  currentMember={member}
                  member={message.member}
                  socketQuery={socketQuery}
                  content={message.content}
                  fileUrl={message.fileUrl}
                  deleted={message.deleted}
                  timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                  isUpdated={message.updatedAt !== message.createdAt}
                />
              ))}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ChatMessages;
