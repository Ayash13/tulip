"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { SideNav } from "../../components/dashboards/side-nav";
import { Menu } from "lucide-react";

interface MobileSidebarProps {
  role: "admin" | "mahasiswa";
}

export function MobileSidebar({ role }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="flex items-center gap-2 p-4 mb-2">
          <Image
            src="/images/Logo_Unpad_Indonesia_tr-1771201662.png"
            alt="Logo Universitas Padjadjaran"
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <span className="font-bold text-lg text-primary">TULIP</span>
        </div>
        <SideNav role={role} className="px-2" />
      </SheetContent>
    </Sheet>
  );
}
