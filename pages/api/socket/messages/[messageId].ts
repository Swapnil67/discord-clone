import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);    
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content } = req.body;
    const { messageId, channelId, serverId } = req.query;

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID Missing" });
    }

    if (!serverId) {
      return res.status(400).json({ message: "Server ID Missing" });
    }

    // * Find ther server
    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });
    console.log("server: ", server);
    
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    // * Find the channel
    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    console.log("channel: ", channel);

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    // * Find the current profile from server members
    const member = server.members.find(
      (member) => member.profileId === profile.id
    );
    console.log("member: ", member);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    // * Find the message for editing
    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // * Delete the message
    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    // * Update the message
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (err) {
    console.log("[MESSAGES_ID]", err);
    return res.status(500).json({ message: "Internal Error" });
  }
}
