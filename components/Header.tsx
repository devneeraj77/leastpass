"use client";

import * as React from "react";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex text-black text-tp h-18 m-2 justify-between p-2 items-center">
      <Link
        href={"/"}
        className="text-sm md:text-base bg-transpLight w-2 h-2 p-2 rounded-full my-1"
      >
        lp.
      </Link>

      <div className="flex gap-2">
        <Link href={"/"} className="hidden md:block py-3">
          contact
        </Link>
      </div>
    </header>
  );
}

export default Header;
