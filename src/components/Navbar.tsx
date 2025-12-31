// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { LogOut, Menu, X, Brain } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  
  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : "U";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020817]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
       
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Interview<span className="text-primary">ly</span>
          </span>
        </Link>

       
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated && (
            <>
              <NavLink href="/dashboard" active={pathname === "/dashboard"}>
                Dashboard
              </NavLink>
              <NavLink href="/interview" active={pathname.startsWith("/interview")}>
                Interview
              </NavLink>
              <NavLink href="/profile" active={pathname === "/profile"}>
                Profile
              </NavLink>
            </>
          )}
        </div>

    
        <div className="flex items-center gap-3">
         
          <div className="flex items-center justify-center text-slate-700 dark:text-slate-200">
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800 ml-2">
              {user && (
                <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                  {getInitials(user.name)}
                </div>
              )}
              <button
                onClick={logout}
                className="p-2 text-slate-700 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-950/30 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3 ml-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-black dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-md shadow-sm transition-all hover:translate-y-[-1px]"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020817] px-4 py-4 space-y-1 shadow-xl">
          {isAuthenticated ? (
            <>
              {user && (
                <div className="pb-3 mb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white capitalize">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}
              <MobileNavLink href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </MobileNavLink>
              <MobileNavLink href="/interview" onClick={() => setMobileMenuOpen(false)}>
                Start Interview
              </MobileNavLink>
              <MobileNavLink href="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </MobileNavLink>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-md mt-2"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </>
          ) : (
            <div className="grid gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-3 py-2.5 text-center text-sm font-bold border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full px-3 py-2.5 text-center text-sm font-bold bg-primary text-white rounded-md hover:bg-primary/90 shadow-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

// NavLinks: Sharp, dark text for maximum visibility
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm transition-all rounded-md ${
        active
          ? "font-bold text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800"
          : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-3 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white rounded-md"
    >
      {children}
    </Link>
  );
}