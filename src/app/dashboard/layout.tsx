import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import Link from "next/link";
import { LogoutButton } from "./_components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await api.auth.me();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="text-xl font-bold text-gray-800">
              Menu Manager
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/profile"
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                {user.fullName}
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

