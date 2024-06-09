import React from 'react'
import Messages from './Messages'
import { MessageCircleIcon, SendIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Message } from '@/lib/types';

const EmbeddedChat = () => {

    const messages: Message[] = [
        {
            content: "My fridge isn't working properly. It's not cooling anymore.",
            sender: "User",
            date: "2023-06-09T10:00:00.000Z"
        },
        {
            content: "Oh no, that sounds frustrating. Have you tried resetting it or checking if the door seal is intact?",
            sender: "Bot",
            date: "2023-06-09T10:05:00.000Z"
        },
        {
            content: "I've already checked the seal and reset it. Still not working.",
            sender: "User",
            date: "2023-06-09T10:10:00.000Z"
        },
        {
            content: "Let's try unplugging it for about 15 minutes then plug it back in. Sometimes, that can reset the system.",
            sender: "Bot",
            date: "2023-06-09T10:15:00.000Z"
        },
        {
            content: "I did that too. Nothing changed. I think it might be a bigger issue.",
            sender: "User",
            date: "2023-06-09T10:20:00.000Z"
        },
        {
            content: "If it's still not working after trying these steps, it might be time to call a professional. They can diagnose the problem accurately.",
            sender: "Bot",
            date: "2023-06-09T10:25:00.000Z"
        },
        {
            content: "I've considered calling a professional, but I wanted to exhaust all options first. Any other suggestions?",
            sender: "User",
            date: "2023-06-09T10:30:00.000Z"
        },
        {
            content: "Before reaching out to a professional, you might want to check the thermostat settings. Ensure it's set to cool and not warm.",
            sender: "Bot",
            date: "2023-06-09T10:35:00.000Z"
        },
        {
            content: "The thermostat is set correctly. I've also noticed condensation on the floor near the fridge. Does that mean anything?",
            sender: "User",
            date: "2023-06-09T10:40:00.000Z"
        },
        {
            content: "Condensation could indicate a refrigerant leak, which would require professional attention. It's best to contact a technician soon to avoid further damage.",
            sender: "Bot",
            date: "2023-06-09T10:45:00.000Z"
        },
        {
            content: "I appreciate your patience and the helpful tips. I'll schedule a service appointment right away.",
            sender: "User",
            date: "2023-06-09T10:50:00.000Z"
        },
        {
            content: "Great, taking action quickly is the best course of action. If you have any more questions or need further assistance, feel free to ask!",
            sender: "Bot",
            date: "2023-06-09T10:55:00.000Z"
        }
    ];

    let botName = "Acme Fridges";
    

    return (
        <div className="flex flex-col h-[500px] w-[400px] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <header className="bg-gray-100 dark:bg-gray-950 px-4 py-3 flex items-center gap-3">
                <div className="rounded-full bg-gray-900 dark:bg-gray-50 text-white dark:text-gray-900 w-8 h-8 flex items-center justify-center">
                    <MessageCircleIcon className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium">{botName}</div>
            </header>
            <Messages messages={messages} />
            <div className="bg-gray-100 dark:bg-gray-950 px-4 py-3 flex items-center gap-3">
                <Textarea
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                >
                    <SendIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>
        </div>
    )
}

export default EmbeddedChat