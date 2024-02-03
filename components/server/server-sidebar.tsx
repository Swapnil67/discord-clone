import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.Text]: <Hash className="mr-2 app-icon" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 app-icon" />,
  [ChannelType.VIDEO]: <Video className="mr-2 app-icon" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 app-icon app-text" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 app-icon app-danger" />,
};

const ServerSidebar = async (props: ServerSidebarProps) => {
  const { serverId } = props;
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.Text
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  // * Find my role in this server
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <ServerSearch
          data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map((channel) => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type],
              })),
            },
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role],
              })),
            },
          ]}
        />
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
