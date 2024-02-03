import { authOptions } from '@/lib/auth';
import BarbershopInfo from '@/components/Barbershop-info';
import ServiceItem from '@/components/Service-item';
import { db } from '@/lib/prisma';
import { Service } from '@prisma/client';
import { getServerSession } from 'next-auth';
import React from 'react';

interface BarbershopDetailsPage {
  params: any;
}

const BarbershopDetailsPage: React.FC<BarbershopDetailsPage> = async ({ params }: BarbershopDetailsPage) => {
  const session = await getServerSession(authOptions);

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id,
    },
    include: {
      Service: true,
    },
  });

  barbershop.Service.forEach((service: Service) => {
    service.price = Number(service.price);
  });

  return (
    <>    
    <BarbershopInfo barbershop={barbershop} />
    <div className='px-5 flex flex-col gap-4 py-6'>
      {barbershop.Service.map((service: Service) => (
        <ServiceItem barbershop={barbershop} service={service} key={service.id} isAuthenticated={!!session?.user}/>
      ))}
    </div>
    </>
  );
};

export default BarbershopDetailsPage;
