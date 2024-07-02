"use client";
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Lightbulb, Menu as MenuIcon } from 'lucide-react';
import { NavBarItems as mobileItems } from '@/constants/constants';
import Link from 'next/link';
import AccountNav from './AccountNav';

const MobileNav = () => {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {/* This button will trigger open the mobile sheet menu */}
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <MenuIcon />
                </Button>
            </SheetTrigger>

            {/* This is the company branding*/}
            <div className="flex items-center gap-2 md:hidden">
                <Lightbulb className="ml-2 w-6 h-6 text-yellow-500" />
                <span className="font-bold text-xl">BrandName</span>
            </div>

            <SheetContent side="left" className="p-4">
                <div className="flex flex-col items-start space-y-2">
                    {mobileItems.map((item) => (
                        <Link href={item.link} key={item.label}>
                            <Button
                                variant="link"
                                onClick={() => setOpen(false)}
                                className="w-full text-left"
                            >
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                    <AccountNav/>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default MobileNav;