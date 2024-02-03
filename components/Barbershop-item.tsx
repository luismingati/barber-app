"use client";

import React from 'react';
import { Card, CardContent } from './ui/card';
import { Barbershop } from '@prisma/client';
import Image from 'next/image';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { StarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';


interface BarbershopItemProps {
  barbershop: Barbershop;
}

const BarbershopItem: React.FC<BarbershopItemProps> = ({ barbershop }: BarbershopItemProps) => {
  const router = useRouter();
  const handleBookingClick = () => {
    router.push(`/barbershop/${barbershop.id}`);
  }

  return (
    <Card className='min-w-[168px] max-w-[168px] rounded-2xl'>
      <CardContent className="p-1">
        <div className=' relative w-full h-[160px]'>
          <Badge variant="secondary" className='opacity-90 absolute top-2 left-2 z-50 flex items-center justify-center gap-1'>
            <StarIcon size={12} className='fill-primary text-primary'/>
            <span>5.0</span>
          </Badge>
          <Image 
            alt='Barbershop Image'
            src={barbershop.imageUrl}
            height={0}
            width={0}
            sizes='100vw'
            fill
            style={{
              objectFit: 'cover',
            }}
            className='rounded-2xl'
          />
        </div>
        <div className='px-2 pb-2'>
          <h2 className='mt-2 font-bold overflow-hidden text-ellipsis text-nowrap'>{barbershop.name}</h2>
          <p className='text-sm text-gray-400 overflow-hidden text-ellipsis text-nowrap'>{barbershop.address}</p>
          <Button variant="secondary" onClick={handleBookingClick} className='w-full mt-3'>Reservar</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarbershopItem;
