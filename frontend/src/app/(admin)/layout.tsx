import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';
import { AdminAuthGuard } from '@/components/admin/admin-auth-guard';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const role = cookieStore.get('shaadwood_role')?.value;

  // Cloak admin entirely: unauthenticated or customer visits return 404
  if (role !== 'ADMIN') {
    notFound();
  }

  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <main className="flex-1 pb-12">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
