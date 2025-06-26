// app/dashboard/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import Dashboard from '@/components/dashboard/Dashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');
  return <Dashboard />;
}
