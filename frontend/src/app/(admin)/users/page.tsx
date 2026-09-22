'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Mail, Phone, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { User } from '@/types';
import { Header } from '@/components/admin/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function UsersPage() {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  return (
    <div className="space-y-8">
      <Header title="Users & Customer Accounts" />

      <div className="px-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Registered Profiles & Addresses</h2>
          <p className="text-xs text-muted-foreground">
            Customer profiles, saved furniture delivery locations, and administrative team members.
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Saved Addresses</TableHead>
                  <TableHead>Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-wood-100 text-wood-800 text-xs font-bold flex items-center justify-center">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          <span>
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.phone || '-'}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs text-wood-800 bg-wood-50 px-2 py-0.5 rounded border border-wood-200/60 font-medium">
                          <MapPin className="w-3 h-3 text-wood-600" />
                          {user._count?.addresses || (user.addresses?.length ?? 0)} addresses
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
