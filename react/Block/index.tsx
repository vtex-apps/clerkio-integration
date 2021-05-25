import React, { useEffect } from 'react'

const ClerkIoBlock = () => {
  useEffect(() => {
    const { Clerk } = window

    Clerk('content', '.clerk-store-block')
  }, [])

  return (
    <div>
      <h2>Clerk Io</h2>
      <span
        className="clerk-store-block"
        data-template="@first-component-content"
      />
    </div>
  )
}

export default ClerkIoBlock
