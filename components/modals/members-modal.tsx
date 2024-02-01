"use client";

import React, { useState } from "react";
import qs from "query-string";
import axios from "axios";
import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  ShieldCheck,
  MoreVertical,
  ShieldQuestion,
  Shield,
  Check,
  Gavel,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/user-avatar";

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const roleIconMap = {
  GUEST: null,
  ADMIN: <ShieldCheck className="app-icon ml-3 text-rose-500" />,
  MODERATOR: <ShieldCheck className="app-icon ml-3 text-indigo-500" />,
};

const MembersModal =  () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async(memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });
      
      const resp = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: resp.data });

    } catch (err) {
      console.log("onKick Error ", err);
      setLoadingId("");
    } finally {
      setLoadingId("");
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id
        }
      });
      const resp = await axios.patch(url, {role});
      router.refresh();
      onOpen("members", { server: resp.data });
    } catch (err) {
      console.log("onRoleChange Error ", err);
      setLoadingId("");
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => {
            return (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gay-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="app-icon text-zinc-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="left">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex items-center">
                              <ShieldQuestion className="app-icon mr-2" />
                              <span>Role</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onRoleChange(member.id, 'GUEST')}>
                                  <Shield className="app-icon mr-4" />
                                  Guest
                                  {member.role === "GUEST" && (
                                    <Check className="app-icon ml-auto" />
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onRoleChange(member.id, 'MODERATOR')}>
                                  <ShieldCheck className="app-icon mr-4" />
                                  Moderator
                                  {member.role === "MODERATOR" && (
                                    <Check className="app-icon ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onKick(member.id)} >
                              <Gavel className="app-icon mr-2" />
                              Kick
                            </DropdownMenuItem>
                          </DropdownMenuSub>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                {loadingId === member.id && (
                  <Loader2 className="animate-spin text-zinc-500 ml-auto app-icon" />
                )}
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
