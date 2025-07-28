"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition-colors hover:text-primary ${
        isActive ? 'font-bold text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
    </Link>
  );
}