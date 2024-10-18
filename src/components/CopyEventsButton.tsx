'use client'
import React, { useState } from 'react'
import { Button, ButtonProps } from './ui/button'
import { Copy, CopyCheck, CopyX } from 'lucide-react'
// const
// typrqiat
type CopyState = 'idle' | 'copied' | 'errored'

const CopyEventsButton = ({
    eventId,
    clerkUserId,
    ...buttonProps
}: Omit<ButtonProps, 'children' | 'onClick'> & { eventId: string, clerkUserId: string }
) => {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const CopyIcon = getCopyIcon(copyState);

  return <Button {...buttonProps} onClick={() => {
    navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
    .then(() => {
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2000);
    })
    .catch(() => {
      setCopyState('errored');
      setTimeout(() => setCopyState('idle'), 2000);
    });
  }}>
    <CopyIcon className='size-4 mr-2' />
    { getChildren(copyState) }
  </Button>
}

export default CopyEventsButton


export const getCopyIcon = (copyState: CopyState) => {
  switch (copyState) {
    case 'idle':
      return Copy;
    case 'copied':
      return CopyCheck;
    case 'errored':
      return CopyX
  }
}

export const getChildren = (copyState: CopyState) => {
  switch (copyState) {
    case 'idle':
      return 'Copy Link';
    case 'copied':
      return 'Copied!';
    case 'errored':
      return 'Error'
  }
}
