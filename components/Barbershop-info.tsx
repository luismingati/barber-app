"use client";

import { Barbershop } from '@prisma/client';
import React from 'react';
import { Button } from './ui/button';
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import SideMenu from './Side-menu';

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

const BarbershopInfo: React.FC<BarbershopInfoProps> = ({barbershop}: BarbershopInfoProps) => {
  const router = useRouter();

  const handleBack = () => {
    router.replace("/");
  }

  return (
    <div className=''>
      <div className='h-[250px] w-full relative'>
        <Button onClick={handleBack} size="icon" variant="outline" className='z-50 top-5 left-8 absolute'>
          <ChevronLeftIcon size={24} />
        </Button>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className='z-50 top-5 right-8 absolute'>
              <MenuIcon size={24} />
            </Button>
          </SheetTrigger>

          <SheetContent className='p-0'>
            <SideMenu />
          </SheetContent>
        </Sheet>
        <Image 
          alt='Barbershop Image'
          src={barbershop.imageUrl}
          fill
          style={{
            objectFit: 'cover',
          }}
        />
      </div>

      <div className='px-5 pt-3 pb-6 border-b border-solid border-secondary'>
        <h1 className='text-xl font-bold'>{barbershop.name}</h1>
        <div className="flex items-center gap-1 mt-2">
          <MapPinIcon size={18} className='text-primary'/>
          <p className='text-sm'>{barbershop.address}</p>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <StarIcon size={18} className='text-primary'/>
          <p className='text-sm'>{barbershop.address}</p>
        </div>
      </div>
    </div>
  );
};

export default BarbershopInfo;
