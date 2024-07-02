"use client";
import { useAuthContext } from '@/lib/context/AuthContext'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link';
import UserAvatar from './UserAvatar';
import { getDisplayName } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const AccountNav = () => {
    const { user, loading } = useAuthContext()

    return (
        <div>
            {(user == null) ? <Link href="/auth/signin">{(!loading) ? <Button>Sign In</Button> : <Button disabled> <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading</Button>}</Link> : <Button className='rounded-l-3xl pl-0'><UserAvatar name={user?.displayName ?? user?.email} /> Logged in as {getDisplayName(user?.displayName ?? user?.email)}</Button>}
        </div>
    )
}

export default AccountNav