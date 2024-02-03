"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

import UserAvatar from "@/components/user-avatar";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="mr-2 app-icon app-text" />,
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 app-icon app-danger" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMap[member.role];

  return (
    <button
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p className={cn('font-semibold text-sm app-text_light500_dark400 app-text-group-hover_light600_dark300', 
      params?.channelId === member.id && 'text-primary dark:group-hover:text-white'
      )}>{member.profile.name}</p>
      {icon}
    </button>
  );
};

export default ServerMember;
