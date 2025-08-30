"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export default function Navbar() {
  return (
    <header className={cn("sticky top-0 z-30")}
    >
      <div className="container-max py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-gradient text-xl">Previo</Link>
        <nav className="flex items-center gap-2">
          {/* <Link href="/theme-showcase" className="btn btn-ghost">Showcase</Link> */}
          {/* <Button variant="gradient">Get Started</Button> */}
        </nav>
      </div>
    </header>
  )
}
