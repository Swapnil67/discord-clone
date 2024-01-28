import { db } from '@/lib/db';
import InitialModal from '@/components/modals/initial-modal'
import { initialProfile } from '@/lib/initial-profile'
import React from 'react'
import { redirect } from 'next/navigation';
import { RedirectToSignIn } from '@clerk/nextjs';


const SetupPage = async () => {
  const profile = await initialProfile();

  if(!profile) {
    return <RedirectToSignIn />
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  // console.log("server: ", server);
  

  if(server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      <InitialModal />
    </div>
  )
}

export default SetupPage