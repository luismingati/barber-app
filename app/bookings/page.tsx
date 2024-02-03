import Header from '@/components/Header';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { db } from '@/lib/prisma';
import BookingItem from '@/components/Booking-item';
import { Booking } from '@prisma/client';
import { isFuture, isPast } from 'date-fns';

const BookingsPage: React.FC = async () => {
  const session = await getServerSession(authOptions);

  if(!session?.user) {
    return redirect("/")
  }

  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as any).id
    },
    include: {
      service: true,
      barbershop: true
    }
  });

  const confirmedBookings = bookings.filter((booking: Booking) => isFuture(booking.date));
  const finishedBookings = bookings.filter((booking: Booking) => isPast(booking.date));

  console.log(bookings)

  return (  
    <>
      <Header />
      <div className='px-5 py-6'>
        <h1 className='text-xl font-bold'>Agendamentos</h1>
        {confirmedBookings.length > 0 &&(
          <h2 className='text-gray-400 uppercase text-sm font-bold mt-6 mb-3'>Confirmados</h2>
        )}
        <div className='flex flex-col gap-3'>
          {confirmedBookings.map((booking: Booking) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>

        {finishedBookings.length > 0 &&(
          <h2 className='text-gray-400 uppercase text-sm font-bold mt-6 mb-3'>Finalizados</h2>
        )}
        <div className='flex flex-col gap-3'>
          {finishedBookings.map((booking: Booking) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>

      </div>
    </>
  );
};

export default BookingsPage;
