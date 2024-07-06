import { Message } from '@/lib/types'
import React from 'react'
import MessageBubble from './MessageBubble'

const Messages = ({ messages }: { messages: Message[] }) => {
    return (
        <div className="flex-1 overflow-auto p-4 grid gap-4">
            {
                messages.map((message: Message) => { return <MessageBubble message={message} /> })
            }
        </div>
    )
}

export default Messages