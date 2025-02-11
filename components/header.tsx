'use client'
import React, { useEffect, useState } from 'react'
import {SignedIn, SignedOut, SignInButton, UserButton, useUser} from '@clerk/nextjs';
import Breadcrumbs from './Breadcrumbs';
import { ModeToggle } from './mode-toggle';
import Logo from './ui/Logo';

const Header = () => {
  const {user} = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className='flex items-center justify-between p-4'>
      {user && isClient && (
        <div className='flex items-center'>
          <Logo className='dark'/>
          &nbsp;
          <h1 className='font-bold text-xl'>CoEdit AI</h1>
        </div>
      )}
      <div className='hidden md:flex lg:flex'>
        <Breadcrumbs/>
      </div>

      <div>
        <SignedOut>
          <SignInButton/>
        </SignedOut>

        <SignedIn>
          <UserButton/>
        </SignedIn>
      </div>
    </div>
  )
}

export default Header