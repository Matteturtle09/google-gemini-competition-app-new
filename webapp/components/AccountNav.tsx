"use client";
import { useAuthContext } from '@/lib/context/AuthContext'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import { getDisplayName } from '@/lib/utils';

const AccountNav = () => {
    const { user, loading } = useAuthContext()

    return (
        <div>
            { (user == null && loading) ? <Link href="/auth/signin"><Button>Sign In</Button></Link> : <Button className='rounded-l-3xl pl-0'><UserAvatar name={user.displayName ?? user.email}/> Logged in as {getDisplayName(user.displayName ?? user.email) }</Button>}
        </div>
    )
}

export default AccountNav