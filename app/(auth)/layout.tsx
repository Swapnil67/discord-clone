import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-indigo-500'>
      <p>header</p>
      <div>{children}</div>
    </div>
  )
}

export default AuthLayout