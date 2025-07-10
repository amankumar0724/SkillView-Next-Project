"use client";

import Link from "next/link";
import { Airplay, Home, LayoutDashboard, Calendar, Video, Contact, Scroll } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FcAbout } from "react-icons/fc";

function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  interface NavLink {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }

  const navLinks: NavLink[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/recordings", label: "Recordings", icon: Video },
    // { href: "/about", label: "About", icon: Scroll},
    { href: "/contact", label: "Contact", icon: Contact },
  ];

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleProtectedNavigation = (href: string) => {
    if (!session) {
      signIn();
    } else {
      router.push(href);
    }
  };

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className="border-b hidden md:block">
        <div className="flex h-16 items-center justify-center px-4 container mx-auto">
          <div className="flex items-center space-x-60">
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-2xl font-mono hover:opacity-80 transition-opacity"
            >
              <Airplay className="size-8 text-[#ed145c]" />
              <span className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] bg-clip-text text-transparent">
                SkillView
              </span>
            </Link>

            {/* NAVIGATION LINKS */}
            <div className="flex items-center space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleProtectedNavigation(link.href)}
                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-[#ed145c] to-[#cb3769] text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* USER ACTIONS */}
            <div className="flex items-center space-x-4 cursor-pointer">
              <ModeToggle />

              {session ? (
                <>
                  {session.user?.image && (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all bg-gradient-to-r from-[#ed145c] to-[#ed145c] text-white dark:bg-gray-700 hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all bg-gradient-to-r from-[#ed145c] to-[#ed145c] text-white dark:bg-gray-700 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE TOP BAR */}
      <nav className="border-b md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-xl font-mono hover:opacity-80 transition-opacity"
          >
            <Airplay className="size-6 text-[#ed145c]" />
            <span className="bg-gradient-to-r from-[#ed145c] to-[#cb3769] bg-clip-text text-transparent">
              SkillView
            </span>
          </Link>

          <div className="flex items-center space-x-3">
            <ModeToggle />
            {session ? (
              <>
                {session.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="cursor-pointer text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-opacity"
                >
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-opacity cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.href}
                onClick={() => handleProtectedNavigation(link.href)}
                className={`cursor-pointer flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all min-w-[60px] ${
                  isActive(link.href)
                    ? "bg-gradient-to-r from-[#ed145c] to-[#cb3769] text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="size-5" />
                <span className="text-[10px]">{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:hidden pb-16"></div>
    </>
  );
}

export default Navbar;