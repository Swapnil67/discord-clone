import { Server as NetServer, Socket as NetSocket } from 'net'
import { NextApiRequest, NextApiResponse } from "next"
import { Server as SocketIOServer } from "socket.io"

import {Server, Member, Profile } from "@prisma/client";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: NetSocket & {
    server: NetServer & {
      io: SocketIOServer;
    }
  }
}