"use client";

import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon, MenuIcon, UserIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import SideMenu from './Side-menu';

const Header: React.FC = () => {

  return (
    <Card> 
      <CardContent className='px-8 py-5 flex justify-between items-center'>
        <Link href="/">
          <h1 className='w-[120px] h-[22px]'>Barber App</h1>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={24}/>
            </Button>
          </SheetTrigger>

          <SheetContent className='p-0'>
            <SideMenu />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;
