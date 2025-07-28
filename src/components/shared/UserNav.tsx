"use client";

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { signOut } from '@/app/(auth)/actions';
import { User } from '@supabase/supabase-js';

interface UserNavProps {
  user: User | null;
  userRole: string;
}

export function UserNav({ user, userRole }: UserNavProps) {
  // Jika TIDAK ADA user, tampilkan link Masuk / Daftar
  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-sm font-medium">
        <Link href="/login" className="transition-colors hover:text-primary">
          Masuk
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/register" className="transition-colors hover:text-primary">
          Daftar
        </Link>
      </div>
    );
  }

  // Jika ADA user, tampilkan dropdown menu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User Avatar" /> 
            <AvatarFallback>
              {user.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Signed in as</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={userRole === 'admin' ? '/admin' : '/dashboard'}>
            Dasbor
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">Pengaturan Akun</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut} className="w-full">
            <button type="submit" className="w-full text-left">
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}