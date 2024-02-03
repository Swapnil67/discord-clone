'use client'

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection = (props: ServerSectionProps) => {
  const { label, role, sectionType, channelType, server } = props;

  const { onOpen } = useModal();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold app-text_light500_dark400">
        {label}
      </p>
      {role != MemberRole.GUEST && sectionType == "channels" && (
        <ActionTooltip label="Create Channel">
          <button onClick={() => onOpen('createChannel', { channelType })} className="app-text_light500_dark400 app-text-hover_light600_dark300 transition">
            <Plus className="app-icon" />
          </button>
        </ActionTooltip>
      )}
      {
        role === MemberRole.ADMIN && sectionType === "members" && (
          <ActionTooltip label="Manage Members">
          <button onClick={() => onOpen('members', { server })} className="app-text_light500_dark400 app-text-hover_light600_dark300 transition">
            <Settings className="app-icon" />
          </button>
        </ActionTooltip>
        )
      }
    </div>
  );
};

export default ServerSection;
