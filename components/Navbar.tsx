"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className={`text-lg font-semibold ${pathname === "/" ? "text-blue-600" : "text-black"}`}>
          Job Listings
        </Link>
        <Link href="/saved-jobs" className={`text-lg font-semibold ${pathname === "/saved-jobs" ? "text-blue-600" : "text-black"}`}>
          Saved Jobs
        </Link>
      </div>
    </nav>
  );
}
