"use client";

import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { isPast } from 'date-fns';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import Image from 'next/image';
import { Button } from './ui/button';
import { cancelBooking } from '@/app/_actions/cancel-booking';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    }
  }>
}

const BookingItem: React.FC<BookingItemProps> = ({ booking }: BookingItemProps) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleCancelClick = async () => {
    setIsDeleteLoading(true);
    try {
      await cancelBooking(booking.id);
      toast.success("Reserva cancelada com sucesso!");
      setIsDeleteLoading(false);
    } catch (error) {
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className='min-w-full'>
          <CardContent className='flex py-0'>
            <div className='flex flex-col gap-2 py-3 flex-[3]'>
              <Badge variant={isPast(booking.date) ? "secondary" : "default"} className='w-fit'>
                {isPast(booking.date) ? 'Finalizado' : 'Confirmado'}
              </Badge>
              <h2 className='font-bold'>{booking.service.name}</h2>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={booking.barbershop.imageUrl} />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <h3 className='text-sm'>{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className='flex flex-col items-center justify-center border-l border-solid border-secondary flex-1'>
              <p className='text-sm'>{format(booking.date, "MMMM", {locale: ptBR})}</p>
              <p className='text-2xl'>{format(booking.date, "dd")}</p>
              <p className='text-sm'>{format(booking.date, "hh:mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className='px-0'>
        <SheetHeader className='px-5 text-left pb-6 border-b border-solid border-secondary '>
          <SheetTitle>
            Informacoes da reserva
          </SheetTitle>
        </SheetHeader>
        <div className="px-5">
          <div className="relative h-[180px] w-full mt-6">
            <Image src={booking.barbershop.imageUrl} alt="alo" layout="fill" style={{objectFit: "contain"}} />
            <div className="w-full absolute bottom-4 left-0 px-5">
              <Card className=''>
                <CardContent className='p-3 flex gap-2'>
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className='font-bold overflow-hidden text-nowrap text-ellipsis'>{booking.barbershop.name}</h2>
                    <h3 className='text-xs overflow-hidden text-nowrap text-ellipsis'>{booking.barbershop.address}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Badge variant={isPast(booking.date) ? "secondary" : "default"} className='w-fit mt-6 mb-3'>
            {isPast(booking.date) ? 'Finalizado' : 'Confirmado'}
          </Badge>
          <Card>
            <CardContent className='p-3 gap-3 flex flex-col'>
              <div className='flex justify-between'>
                <h2 className='font-bold'>{booking.service.name}</h2>
                <h3 className='font-bold text-sm'>{Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Number(booking.service.price))}
                </h3>
              </div>
              {booking.date && (
                <div className="flex justify-between">
                  <p className='text-gray-400 text-sm'>Data</p>
                  <p className='text-sm'>{format(booking.date, "dd 'de' MMMM", {
                    locale: ptBR,
                  })}</p>
                </div>
              )}
              <div className="flex justify-between">
                <p className='text-gray-400 text-sm'>Horário</p>
                <p className='text-sm'>{format(booking.date, "hh:mm")}</p>
              </div>
              <div className="flex justify-between">
                <p className='text-gray-400 text-sm'>Barbearia</p>
                <p className='text-sm'>{booking.barbershop.name}</p>
              </div>
            </CardContent>
          </Card>
          <SheetFooter className='flex flex-row w-full gap-3 mt-6'>
            <SheetClose asChild>
              <Button className='w-full' variant="secondary">Voltar</Button>
            </SheetClose>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isPast(booking.date) || isDeleteLoading} className='w-full' variant="destructive">
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='w-[90%]'>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-center'>Deseja mesmo cancelar sua reserva?</AlertDialogTitle>
                  <AlertDialogDescription className='text-center'>
                    Ao cancelar sua reserva, você estará abrindo mão do seu horário e não poderá mais recuperá-lo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex flex-row w-full gap-3'>
                  <AlertDialogCancel className='flex-1'>Voltar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelClick} disabled={isDeleteLoading} className='flex-1'>
                    {isDeleteLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                    )}
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BookingItem;
