import BarbershopItem from "@/components/Barbershop-item";
import BookingItem from "@/components/Booking-item";
import Header from "@/components/Header";
import Search from "@/components/Search";
import { db } from "@/lib/prisma";
import { Barbershop } from "@prisma/client";
import { format } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const barbershops = await db.barbershop.findMany({})

  const bookings = session?.user
    ? await db.booking.findMany({
      where: {
        userId: (session?.user as any).id,
        date: {
          gte: new Date()
        }
      },
      include: {
        barbershop: true,
        service: true
      }
    }) 
    : [];

  return (
    <>
      <Header />
      <div className="px-5 pt-5">
        {session?.user ? (
          <h2 className="text-xl font-bold">Olá, Luis!</h2>
        ) : (
          <h2 className="text-xl font-bold">Olá, seja bem-vindo!</h2>
        )}
        
        <p className="capitalize text-sm">{format(new Date(), "EEEE',' d 'de' MMMM", {
          locale: ptBR 
        })}
        </p>
      </div>

      <div className="px-5 mt-6">
        <Search />
      </div>

      {bookings.length > 0 && (
        <div className="mt-6">
          <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
          <div className=" px-5 flex gap-3 overflow-x-auto">
            {bookings.map((booking: any) => (
              <BookingItem key={booking.id} booking={booking} />
            ))}
          </div>  
        </div>
      )}

      <div className="mt-6">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Recomendados</h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: Barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>

      <div className="mt-6 mb-16">
        <h2 className="px-5 text-xs uppercase text-gray-400 font-bold mb-3">Populares</h2>
        <div className="flex px-5 gap-4 overflow-x-auto [&::webkit-scrollbar]:hidden">
          {barbershops.map((barbershop: Barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </>
  );
}
