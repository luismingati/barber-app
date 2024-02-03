"use client";
import { Booking } from '@prisma/client';
import React from 'react';

interface BookingListProps {
  booking: Booking;
}

const BookingList: React.FC<BookingListProps> = () => {
  return (
    <div>
      {/* Your component content goes here */}
    </div>
  );
};

export default BookingList;
