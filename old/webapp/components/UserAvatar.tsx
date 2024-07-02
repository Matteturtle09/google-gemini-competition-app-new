import React from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { getDisplayName, initials } from '@/lib/utils';

const UserAvatar = ({name}:{name: string}) => {
    var displayName = getDisplayName(name);

    

    return (
        <Avatar className='mr-2'>
            <AvatarImage src={`https://api.dicebear.com/8.x/notionists-neutral/svg?seed=${displayName}`} />
            <AvatarFallback>{initials(displayName)}</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar