import { useUser, UserButton, Protect } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { LayoutDashboard, Wallet, Users, BarChart2, ChevronLeft, ChevronRight } from "lucide-react";
import PageTransition from "./PageTransition";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/advisor-team", label: "Advisor Team", icon: Users },
  { href: "/analysis", label: "Analysis", icon: BarChart2 },
];

export default function Layout({ children }: LayoutProps) {
  const { user } = useUser();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => router.pathname === path || router.pathname.startsWith(path + "/");

  return (
    <Protect fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    }>
      <div className="min-h-screen flex bg-gray-50">
        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex flex-col z-20 transition-all duration-200 ${collapsed ? "w-16" : "w-56"}`}>
          {/* Logo */}
          <div className={`flex items-center h-16 px-4 border-b border-gray-200 ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
                <span className="text-base font-bold text-dark truncate">Alex <span className="text-primary">AI</span></span>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex-shrink-0"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-4 space-y-1 px-2">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={`flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className={`border-t border-gray-200 p-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <UserButton />
            {!collapsed && (
              <span className="text-xs text-gray-500 truncate">
                {user?.firstName || user?.emailAddresses[0]?.emailAddress}
              </span>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 flex flex-col min-h-screen transition-all duration-200 ${collapsed ? "ml-16" : "ml-56"}`}>
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>

          <footer className="bg-white border-t">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-700 mb-1">Important Disclaimer</p>
                <p className="text-xs text-gray-500">
                  AI-generated advice has not been vetted by a qualified financial advisor and should not be used for trading decisions. For informational purposes only.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Protect>
  );
}
