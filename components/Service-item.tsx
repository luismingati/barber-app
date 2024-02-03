"use client";

import { Barbershop, Booking, Service } from '@prisma/client';
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from './ui/card';
import Image from 'next/image';
import { Button } from './ui/button';
import { signIn, useSession } from 'next-auth/react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Calendar } from './ui/calendar';
import { ptBR } from 'date-fns/locale';
import { generateDayTimeList } from '@/app/barbershop/[id]/_helper/hours';
import { format } from 'date-fns/format';
import { saveBooking } from '@/app/barbershop/[id]/_actions/save-booking';
import { setHours, setMinutes } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { getDayBookings } from '@/app/barbershop/[id]/_actions/get-bookings';

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({service, isAuthenticated, barbershop}: ServiceItemProps) => {
  const router = useRouter();

  const { data } = useSession();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      signIn("google");
    }
  }

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      if(!hour || !date || !data?.user) {
        return
      };

      const newDate = setMinutes(setHours(date, Number(hour.split(":")[0])), Number(hour.split(":")[1]));

      await saveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: newDate,
        userId: (data?.user as any).id
      })

      setLoading(false);
      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast("Reserva realizada com sucesso!", {
        description: format(newDate, "'Para' dd 'de' MMMM 'às' HH:mm", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  }

  const handleHourClick = (time: string) => {
    setHour(time);
  }

  useEffect(() => {
    if(!date) {
      return;
    }

    const refreshAvailableHours = async () => {
      const dayBookings = await getDayBookings(barbershop.id ,date)
      setDayBookings(dayBookings);
    }

    refreshAvailableHours();
  }, [date, barbershop.id])

  const timeList = useMemo(() => {
    if(!date) {
      return [];
    }

    return generateDayTimeList(date).filter(time => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinute = Number(time.split(":")[1]);

      const booking = dayBookings.find(booking => {
        const bookingHour = booking.date.getHours();
        const bookingMinute = booking.date.getMinutes();

        return timeHour === bookingHour && timeMinute === bookingMinute;
        }
      );

      if(!booking) {
        return true;
      }

      return false
    })

  }, [date, dayBookings])

  return (
    <Card>
      <CardContent className='p-3'>
        <div className="flex gap-4 items-center">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image 
              sizes='(max-width: 640px) 100vw, 640px'
              className='rounded-lg'
              alt='Service Image'
              src={service.imageUrl}
              fill
              width={0}
              height={0}
              style={{objectFit: 'contain'}}
            />
          </div>
          <div className='flex-col flex w-full'>
            <h2 className='font-bold text-base'>{service.name}</h2>
            <p className='text-sm text-gray-400'>{service.description}</p>

            <div className="flex items-center justify-between">
              <p className='text-primary font-bold text-sm mt-2'>{Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild >
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className='p-0'>
                  <SheetHeader className='text-left px-5 py-6 border-b border-solid border-secondary'>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateClick}
                      className='mt-6'
                      locale={ptBR}
                      fromDate={new Date()}
                      styles={{
                        head_cell: {
                          width: '100%',
                          textTransform: 'capitalize',
                        },
                        cell: {
                          width: '100%',
                        },
                        button: {
                          width: '100%',
                        },
                        nav_button_previous: {
                          width: '32px',
                          height: '32px',
                        },
                        nav_button_next: {
                          width: '32px',
                          height: '32px',
                        },
                        caption: {
                          textTransform: 'capitalize',
                        }
                      }}
                    />
                  </div>

                  {date && (
                    <div className='flex overflow-x-auto [&::webkit-scrollbar]:hidden gap-3 py-6 px-5 border-y border-solid border-secondary'>
                      {timeList.map((time) => (
                        <Button onClick={() => handleHourClick(time)} variant={hour === time ? "default" : "outline"} className='rounded-full' key={time}>
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className='py-6 px-5'>
                    <Card>
                      <CardContent className='p-3 gap-3 flex flex-col'>
                        <div className='flex justify-between'>
                          <h2 className='font-bold'>{service.name}</h2>
                          <h3 className='font-bold text-sm'>{Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>
                        {date && (
                          <div className="flex justify-between">
                            <p className='text-gray-400 text-sm'>Data</p>
                            <p className='text-sm'>{format(date, "dd 'de' MMMM", {
                              locale: ptBR,
                            })}</p>
                          </div>
                        )}
                        {hour && (
                          <div className="flex justify-between">
                            <p className='text-gray-400 text-sm'>Horário</p>
                            <p className='text-sm'>{hour}</p>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <p className='text-gray-400 text-sm'>Barbearia</p>
                          <p className='text-sm'>{barbershop.name}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <SheetFooter className='px-5'>
                    <Button disabled={!hour || !date || loading} onClick={handleBookingSubmit} >
                      {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin'/>}
                      Confirmar reserva
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
