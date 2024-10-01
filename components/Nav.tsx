"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Kristi, Satisfy } from "next/font/google";

// const satisfy = Satisfy({
//   subsets: ["latin"],
//   weight: "400",
// });

export function NavbarDemo() {
  return (
    <div className="relative w-full text-ts flex-col  flex h-28 items-center justify-end">
      <Navbar className=" top-4" />
      <p className="text-tAccent text-center py-2">
        Create your unique password with leastpass!
      </p>
      <div className="flex text-tp gap-2">
        <Link href={"/"} className="flex active:tAccent hover:tAccent">
          lp
          <svg
            className="bg-transpLight rounded-md"
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="currentColor"
          >
            <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
          </svg>
        </Link>
        <Link
          href={"/"}
          className="flex underline hover:text-tAccent active:text-tAccent"
        >
          contact
          <svg
            className="bg-transpLight rounded-md"
            xmlns="http://www.w3.org/2000/svg"
            height="18px"
            viewBox="0 -960 960 960"
            width="18px"
            fill="currentColor"
          >
            <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-fit  sm:max-w-xs md:max-w-2xl mx-auto z-50",
        className
      )}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col bg-sl space-y-4 text-sm">
            <HoveredLink href="https://neerajrekwar.github.io/about/#project">
              Web Development
            </HoveredLink>
            <HoveredLink href="https://neerajrekwar.github.io/">
              Interface Design
            </HoveredLink>
            <HoveredLink href="https://neerajrekwar.github.io/contact">
              Search Engine Optimization
            </HoveredLink>
            <HoveredLink href="https://neerajrekwar.github.io/about/#footer">
              Branding
            </HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
          <div className=" text-sm mb md:grid md:grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="https://images.unsplash.com/photo-1638864616266-c390568f9092?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              description="Prepare for tech interviews like never before."
            />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="https://images.unsplash.com/photo-1637952112301-6090dca83ccb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              description="Production ready Tailwind css components for your next project"
            />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="https://images.unsplash.com/photo-1663970206579-c157cba7edda?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              description="Never write from scratch again. Go from idea to blog in minutes."
            />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="https://images.unsplash.com/photo-1637963953070-e0f3d08da3c1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
            />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
