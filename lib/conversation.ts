import { db } from "@/lib/db";

export const getOrCreateConverstation = async (memberOneId: string, memberTwoId: string) => {
  try {
    let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId)
    if(!conversation) {
      conversation = await createNewConversation(memberOneId, memberTwoId);
    }
    return conversation;
  } catch (err) {
    console.log("getOrCreateConverstation Error ", err);
    
  }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (err) {
    console.log("findConversation Error ", err);
    return null;
  }
};

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId
      }, 
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      }
    })
  } catch (err) {
    console.log("createNewConversation Error ", err);
    return null;
  }
}
