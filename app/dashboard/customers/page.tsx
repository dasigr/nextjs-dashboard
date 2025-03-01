import Table from '@/app/ui/customers/table';
import { fetchCustomers } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <Table customers={customers} />
  );
}
