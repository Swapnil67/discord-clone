'use client'

import CreateServerModal from "@/components/modals/create-server-modal"
import { useEffect, useState } from "react"


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  
  // * Prevents modals to render on server side
  // * Which creates hydration-error
  useEffect(() => {
    setIsMounted(true);
  },[])

  if(!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal/>
    </>
  )
}