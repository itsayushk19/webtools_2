"use client"

import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, UserButton, SignedOut } from '@clerk/nextjs'
import { navLinks } from '@/constants'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'

const MobileNav = () => {
    const pathname = usePathname();
    console.log(navLinks)
    return (
        <header className='header'>
            <Link href='/' className="flex  items-center gap-2 md:py-2">
                <Image
                    src={'/assets/images/logo-text.svg'}
                    alt='logo'
                    width={180}
                    height={28}
                ></Image>
            </Link>

            <nav className='mobile-nav flex flex-row gap-2'>
                <SignedIn>
                    <UserButton afterSignOutUrl='/' />
                    <Sheet>
                        <SheetTrigger>
                            <Image src={'/assets/icons/menu.svg'} alt='menuIcon' width={32} height={32} />
                        </SheetTrigger>
                        <SheetContent className='sheet-content sm:w-64'>
                            <>
                                {navLinks.slice(0).map((link) => {
                                    const isActive = link.route === pathname

                                    return (
                                        <li
                                            key={link.route}
                                            className={`${isActive && 'activeText'} flex
                  whitespace-nowrap text-dark-700
                  `}>
                                            <Link className="sidebar-link cursor-pointer" href={link.route}>
                                                <Image
                                                    src={link.icon}
                                                    alt="logo"
                                                    width={24}
                                                    height={24}
                                                    className={``}
                                                />
                                                {link.label}
                                            </Link>
                                        </li>
                                    )
                                })}
                            </>
                        </SheetContent>
                    </Sheet>
                </SignedIn>
                <SignedOut>
                    <Button asChild className='button activeBgGradient bg-cover'>
                        <Link href="/sign-in">Login</Link>
                    </Button>
                </SignedOut>
            </nav>
        </header>
    )
}

export default MobileNav
