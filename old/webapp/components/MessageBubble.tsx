import { Message } from '@/lib/types'
import { MessageCircleIcon, UserIcon, BotIcon, SendIcon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

const MessageBubble = ({ message }: { message: Message }) => {
    return (
        <>
            {message.sender == "User" ? <div className="flex items-start gap-3">
                <div className="rounded-full bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 w-8 h-8 flex items-center justify-center">
                    <UserIcon className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg max-w-[70%]">
                    <p className="text-sm">{message.content}</p>
                </div>
            </div> : <div className="flex items-start gap-3 justify-end">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg max-w-[70%]">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                        {message.content}
                    </p>
                </div>
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 w-8 h-8 flex items-center justify-center">
                    <BotIcon className="h-4 w-4" />
                </div>
            </div>}


        </>
    )
}

export default MessageBubble

