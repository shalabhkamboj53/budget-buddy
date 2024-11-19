import React from 'react'

type props = {
    children: React.ReactNode
}

const PublicRoute = ({children}:props) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default PublicRoute
