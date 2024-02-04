"use client";
import React from "react";

import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import ActionTooltip from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.Text]: (
    <Hash className="flex-shrink-0 app-icon-lg app-text_light500_dark400" />
  ),
  [ChannelType.AUDIO]: (
    <Mic className="flex-shrink-0 app-icon-lg app-text_light500_dark400" />
  ),
  [ChannelType.VIDEO]: (
    <Video className="flex-shrink-0 app-icon-lg app-text_light500_dark400" />
  ),
};

const ServerChannel = (props: ServerChannelProps) => {
  const { channel, server, role } = props;
  const params = useParams();
  const router = useRouter();

  const { onOpen } = useModal();

  const Icon = iconMap[channel.type];

  return (
    <button
      onClick={() => {}}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc/700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      {Icon}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-sm app-text_light500_dark400 app-text-group-hover_light600_dark300 transition",
          params?.channelId === channel.id &&
            "app-text_primary_dark200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit">
            <Edit onClick={() => onOpen("editChannel", { server, channel })} className="hidden group-hover:block app-icon app-text_light500_dark400 app-text-hover_light600_dark300" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => onOpen("deleteChannel", { server, channel })}
              className="hidden group-hover:block app-icon app-text_light500_dark400 app-text-hover_light600_dark300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <ActionTooltip label="Locked">
          <Lock className="ml-auto app-icon app-text_light500_dark400 app-text-hover_light600_dark300" />
        </ActionTooltip>
      )}
    </button>
  );
};

export default ServerChannel;
