"use client";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";
import { cn } from "@/lib/utils";

import { Form, FormItem, FormField, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="app-icon ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="app-icon ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = (props: ChatItemProps) => {
  const {
    id,
    member,
    fileUrl,
    content,
    deleted,
    socketUrl,
    timestamp,
    isUpdated,
    socketQuery,
    currentMember,
  } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values: ", values);
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (err) {
      console.log("Error ", err);
    }
  };

  // * When received realtime message
  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [form, content]);

  const isAdmin = currentMember.role === MemberRole["ADMIN"];
  const isModerator = currentMember.role === MemberRole["MODERATOR"];

  const isOwner = currentMember.id === member.id;
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);

  const fileType = fileUrl?.split(".").pop();

  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        {/* Avatar */}
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>

        <div className="flex flex-col w-full">
          <div className="fkex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>

            <span className="text-xs app-text_light500_dark400">
              {timestamp}
            </span>
          </div>

          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
              rel="noopener noreferrer"
            >
              <Image
                alt={content}
                src={fileUrl}
                className="object-cover"
                fill
              />
            </a>
          )}

          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopner noreferrer"
                className="ml-2 text-sm app-text hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-600 app-text_light600_dark400",
                deleted && "italic app-text_light500_dark400 text-sm mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 app-text_light500_dark400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            {...field}
                            disabled={isLoading}
                            placeholder="Edited message"
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 app-text_light600_dark200"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer app-icon ml-auto app-text_light500_dark600 app-text-hover_light600_dark300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() => setIsDeleting(true)}
              className="cursor-pointer app-icon ml-auto app-text_light500_dark600 app-text-hover_light600_dark300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
