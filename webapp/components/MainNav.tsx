// MainNav.tsx
import Link from 'next/link';
import { Button } from './ui/button';
import { NavBarItems as mainNavItems } from '@/constants/constants';
import { Lightbulb } from 'lucide-react';
import AccountNav from './AccountNav';

const MainNav = () => {
    return (
        <div className='mr-4 hidden gap-2 md:flex w-full'>
            <nav className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <span className="font-bold text-xl">BrandName</span>
                </div>
                <div className="flex gap-2 flex-grow justify-center">
                    {mainNavItems.map((item) => (
                        <Link href={item.link} key={item.label}>
                            <Button variant="link" className="hover:text-yellow-500">
                                {item.label}
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="flex items-center">
                    <AccountNav />
                </div>
            </nav>
        </div>
    );
}

export default MainNav;
