'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  UserCheck,
  Search,
  Sliders,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Lock,
  UserX,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { User, Role } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { HoldToDeleteButton } from '@/components/admin/hold-to-delete-button';
import { formatDate, cn } from '@/lib/utils';

export default function UsersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Search & Filters State
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'ALL' | 'CUSTOMER' | 'ADMIN'>('ALL');

  // Create User Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [createFirstName, setCreateFirstName] = React.useState('');
  const [createLastName, setCreateLastName] = React.useState('');
  const [createEmail, setCreateEmail] = React.useState('');
  const [createPhone, setCreatePhone] = React.useState('');
  const [createPassword, setCreatePassword] = React.useState('');
  const [createRole, setCreateRole] = React.useState<Role>('CUSTOMER');
  const [createIsActive, setCreateIsActive] = React.useState(true);

  // Quick Edit Modal State
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [editFirstName, setEditFirstName] = React.useState('');
  const [editLastName, setEditLastName] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');
  const [editPhone, setEditPhone] = React.useState('');
  const [editPassword, setEditPassword] = React.useState('');
  const [editRole, setEditRole] = React.useState<Role>('CUSTOMER');
  const [editIsActive, setEditIsActive] = React.useState(true);

  // Delete Confirmation Warning State
  const [deleteConfirmUser, setDeleteConfirmUser] = React.useState<User | null>(null);

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
  });

  // Calculate Metrics
  const stats = React.useMemo(() => {
    let customerCount = 0;
    let adminCount = 0;
    let activeCount = 0;

    users.forEach((u) => {
      if (u.role === 'ADMIN') adminCount++;
      else customerCount++;
      if (u.isActive) activeCount++;
    });

    return {
      total: users.length,
      customers: customerCount,
      admins: adminCount,
      active: activeCount,
    };
  }, [users]);

  // Filtered users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone && u.phone.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => api.createUser(data),
    onSuccess: (newUser) => {
      toast.success(`Account for ${newUser.firstName} ${newUser.lastName} created`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateOpen(false);
      resetCreateForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create account');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateUser(id, data),
    onSuccess: (updated) => {
      toast.success(`Account for ${updated.firstName} ${updated.lastName} updated`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update user');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      toast.success('User account deleted permanently');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteConfirmUser(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete user');
    },
  });

  // Handlers
  const resetCreateForm = () => {
    setCreateFirstName('');
    setCreateLastName('');
    setCreateEmail('');
    setCreatePhone('');
    setCreatePassword('');
    setCreateRole('CUSTOMER');
    setCreateIsActive(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditEmail(user.email);
    setEditPhone(user.phone || '');
    setEditPassword('');
    setEditRole(user.role);
    setEditIsActive(user.isActive);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      firstName: createFirstName.trim(),
      lastName: createLastName.trim(),
      email: createEmail.trim().toLowerCase(),
      phone: createPhone.trim() || undefined,
      password: createPassword.trim(),
      role: createRole,
      isActive: createIsActive,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const payload: any = {
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      email: editEmail.trim().toLowerCase(),
      phone: editPhone.trim() || undefined,
      role: editRole,
      isActive: editIsActive,
    };

    if (editPassword.trim()) {
      payload.password = editPassword.trim();
    }

    updateMutation.mutate({ id: editingUser.id, data: payload });
  };

  return (
    <div className="space-y-8 pb-16">
      <Header title="Users & Customer Accounts" />

      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Registered Profiles & Accounts
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Customer accounts, delivery addresses, and administrative store management team.
          </p>
        </div>

        {/* Metrics KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Total Accounts</p>
                <p className="text-xl font-bold text-foreground">{stats.total}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Store Customers</p>
                <p className="text-xl font-bold text-wood-700 dark:text-wood-300">{stats.customers}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-wood-100 dark:bg-wood-950/40 text-wood-700 dark:text-wood-300 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Active Profiles</p>
                <p className="text-xl font-bold text-emerald-600">{stats.active}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-2xs border-border/80 bg-card/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Administrators</p>
                <p className="text-xl font-bold text-foreground">{stats.admins}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Search Toolbar - Consistent with Products Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users by name, email, or phone..."
                className="pl-9 bg-card h-9"
              />
            </div>

            {/* Role Filter Buttons - Matching Search Box Height (h-9) */}
            <div className="flex items-center rounded-lg border border-border bg-card p-1 text-xs shrink-0 h-9 box-border">
              <button
                type="button"
                onClick={() => setRoleFilter('ALL')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  roleFilter === 'ALL'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('CUSTOMER')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  roleFilter === 'CUSTOMER'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Customers
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('ADMIN')}
                className={`h-full px-3 rounded-md font-medium transition-colors flex items-center justify-center ${
                  roleFilter === 'ADMIN'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Admins
              </button>
            </div>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shrink-0 font-semibold shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* 1. MOBILE VIEW: Responsive Cards (Matching Products style) */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl">
              Loading registered user profiles...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-card border border-border rounded-xl space-y-2 p-4">
              <Sliders className="w-8 h-8 text-muted-foreground opacity-40 mx-auto" />
              <p className="font-semibold text-foreground">No accounts found</p>
              <p className="text-xs text-muted-foreground">
                {search || roleFilter !== 'ALL'
                  ? 'No user accounts match your active search filters.'
                  : 'Create your first user or customer profile.'}
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}`.toUpperCase();
              const addressCount = user._count?.addresses || user.addresses?.length || 0;

              return (
                <div
                  key={user.id}
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="p-4 rounded-xl border border-border bg-card shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-3"
                >
                  {/* Card Header: Avatar + Name + Role Badge */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-wood-200 dark:bg-wood-950 text-wood-900 dark:text-wood-200 text-sm font-bold flex items-center justify-center shrink-0 border border-wood-300 shadow-2xs">
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        <Badge
                          variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                          className="text-[10px] shrink-0"
                        >
                          {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Phone & Saved Addresses with Border Divider */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-mono truncate">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{user.phone || 'No phone'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/60">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span>{addressCount} {addressCount === 1 ? 'address' : 'addresses'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Footer: Status Indicator + Joined Date + Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.isActive ? 'bg-emerald-500' : 'bg-destructive'
                          }`}
                        />
                        <span className="font-medium text-foreground">
                          {user.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                      <span>•</span>
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(user);
                        }}
                        title="Quick edit user"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmUser(user);
                        }}
                        title="Delete user"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 2. DESKTOP VIEW: Clean Table */}
        <Card className="hidden md:block overflow-hidden border-border/80 shadow-xs">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 text-center text-xs text-muted-foreground">
                Loading registered user profiles...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-16 text-center space-y-3 max-w-sm mx-auto p-4">
                <Sliders className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">No accounts found</h3>
                  <p className="text-xs text-muted-foreground">
                    {search || roleFilter !== 'ALL'
                      ? 'No user accounts match your active search filters.'
                      : 'Create your first user or customer profile.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                    <tr>
                      <th className="py-3 px-4">User Profile</th>
                      <th className="py-3 px-4">Contact & Phone</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Saved Addresses</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {filteredUsers.map((user) => {
                      const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}`.toUpperCase();
                      const addressCount = user._count?.addresses || user.addresses?.length || 0;

                      return (
                        <tr
                          key={user.id}
                          onClick={() => router.push(`/users/${user.id}`)}
                          className="cursor-pointer hover:bg-muted/40 transition-colors group/row"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-wood-200 dark:bg-wood-950 text-wood-900 dark:text-wood-200 text-xs font-bold flex items-center justify-center shrink-0 border border-wood-300">
                                {initials}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-foreground group-hover/row:text-primary transition-colors block truncate">
                                  {user.firstName} {user.lastName}
                                </div>
                                <span className="font-mono text-xs text-muted-foreground block truncate">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-muted-foreground font-mono">
                            {user.phone || '—'}
                          </td>

                          <td className="py-3.5 px-4">
                            <Badge
                              variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
                            </Badge>
                          </td>

                          <td className="py-3.5 px-4">
                            {user.isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                                <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                Suspended
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md font-medium">
                              <MapPin className="w-3 h-3 text-primary" />
                              {addressCount} {addressCount === 1 ? 'address' : 'addresses'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-xs text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEdit(user);
                                }}
                                title="Edit user"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirmUser(user);
                                }}
                                title="Delete user"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CREATE USER DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader className="pr-6">
            <DialogTitle>Add New Account</DialogTitle>
            <DialogDescription>
              Create a new customer account or store administrator profile.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">First Name *</label>
                <Input
                  required
                  placeholder="e.g., Alexander"
                  value={createFirstName}
                  onChange={(e) => setCreateFirstName(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Last Name *</label>
                <Input
                  required
                  placeholder="e.g., Wright"
                  value={createLastName}
                  onChange={(e) => setCreateLastName(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Email Address *</label>
                <Input
                  required
                  type="email"
                  placeholder="alexander@example.com"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <Input
                  placeholder="+1 555-0192"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Initial Password *</label>
              <Input
                required
                type="password"
                placeholder="At least 6 characters"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                className="text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Role</label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as Role)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="CUSTOMER">Customer (Default)</option>
                  <option value="ADMIN">Store Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Account Status</label>
                <select
                  value={createIsActive ? 'active' : 'inactive'}
                  onChange={(e) => setCreateIsActive(e.target.value === 'active')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Suspended / Inactive</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {createMutation.isPending ? 'Creating Account...' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* QUICK EDIT USER DIALOG */}
      <Dialog open={Boolean(editingUser)} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader className="pr-6">
            <DialogTitle>Quick Edit User: {editingUser?.firstName} {editingUser?.lastName}</DialogTitle>
            <DialogDescription>
              Update basic credentials, role authorization, or account status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">First Name *</label>
                <Input
                  required
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Last Name *</label>
                <Input
                  required
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Email Address *</label>
                <Input
                  required
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Phone Number</label>
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">
                Reset Password <span className="font-normal text-muted-foreground">(leave blank to keep current)</span>
              </label>
              <Input
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as Role)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Store Administrator</option>
                </select>
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Account Status</label>
                <select
                  value={editIsActive ? 'active' : 'inactive'}
                  onChange={(e) => setEditIsActive(e.target.value === 'active')}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-2xs focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Suspended / Inactive</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* WARNING MODAL: DELETE USER */}
      <Dialog
        open={Boolean(deleteConfirmUser)}
        onOpenChange={() => setDeleteConfirmUser(null)}
      >
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Delete Account &quot;{deleteConfirmUser?.firstName} {deleteConfirmUser?.lastName}&quot;?
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm">
              <p>
                Are you sure you want to permanently delete the account for{' '}
                <strong className="text-foreground">
                  {deleteConfirmUser?.firstName} {deleteConfirmUser?.lastName} ({deleteConfirmUser?.email})
                </strong>?
              </p>

              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1 text-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Irreversible Action Warning:
                </p>
                <p>
                  This will permanently erase the user profile, credentials, and all{' '}
                  <strong>{deleteConfirmUser?._count?.addresses || deleteConfirmUser?.addresses?.length || 0} saved delivery addresses</strong>.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteConfirmUser(null)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              className="w-full sm:w-auto font-semibold"
              onTrigger={() => deleteConfirmUser && deleteMutation.mutate(deleteConfirmUser.id)}
              isPending={deleteMutation.isPending}
              label="Delete Account"
              pendingLabel="Deleting Account..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
