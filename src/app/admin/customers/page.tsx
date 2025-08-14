// File: src/app/admin/customers/page.tsx
import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';

export default async function AdminCustomersPage() {
  const supabase = createClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <p className="text-red-500">Gagal memuat data pelanggan: {error.message}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Pelanggan</CardTitle>
        <CardDescription>Lihat semua pengguna yang terdaftar di toko Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran (Role)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles?.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.full_name || '-'}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                      {profile.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}