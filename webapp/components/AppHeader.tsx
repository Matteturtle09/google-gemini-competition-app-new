import React from 'react'
import MainNav from './MainNav'
import MobileNav from './MobileNav'

const AppHeader = () => {
    return (
        <header className="w-full border-b">
            <div className="flex h-14 items-center px-4">
                <MainNav />
                <MobileNav />
            </div>
        </header>
    )
}

export default AppHeader