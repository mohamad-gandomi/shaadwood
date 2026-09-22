'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Users,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  UserCheck,
  Pencil,
  Trash2,
  Plus,
  Lock,
  Save,
  Calendar,
  Clock,
  KeyRound,
  ShieldAlert,
  AlertTriangle,
  Check,
  Building,
  Home,
  Copy,
  ExternalLink,
  UserX,
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { User, Address, Role } from '@/types';
import { Header } from '@/components/admin/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = params.id;

  const [activeTab, setActiveTab] = React.useState('profile');

  // Query User details
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
  });

  // Profile Form State
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [role, setRole] = React.useState<Role>('CUSTOMER');
  const [isActive, setIsActive] = React.useState(true);
  const [password, setPassword] = React.useState('');

  // Add Address Modal State
  const [isAddressOpen, setIsAddressOpen] = React.useState(false);
  const [addrTitle, setAddrTitle] = React.useState('Home');
  const [addrRecipient, setAddrRecipient] = React.useState('');
  const [addrPhone, setAddrPhone] = React.useState('');
  const [addrStreet, setAddrStreet] = React.useState('');
  const [addrCity, setAddrCity] = React.useState('');
  const [addrProvince, setAddrProvince] = React.useState('');
  const [addrPostalCode, setAddrPostalCode] = React.useState('');
  const [addrDefaultShipping, setAddrDefaultShipping] = React.useState(false);
  const [addrDefaultBilling, setAddrDefaultBilling] = React.useState(false);

  // Edit Address Modal State
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [editAddrTitle, setEditAddrTitle] = React.useState('Home');
  const [editAddrRecipient, setEditAddrRecipient] = React.useState('');
  const [editAddrPhone, setEditAddrPhone] = React.useState('');
  const [editAddrStreet, setEditAddrStreet] = React.useState('');
  const [editAddrCity, setEditAddrCity] = React.useState('');
  const [editAddrProvince, setEditAddrProvince] = React.useState('');
  const [editAddrPostalCode, setEditAddrPostalCode] = React.useState('');
  const [editAddrDefaultShipping, setEditAddrDefaultShipping] = React.useState(false);
  const [editAddrDefaultBilling, setEditAddrDefaultBilling] = React.useState(false);

  // Delete Warning States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteAddrId, setDeleteAddrId] = React.useState<string | null>(null);

  // Pre-fill form when user query data loads
  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || 'CUSTOMER');
      setIsActive(user.isActive ?? true);
      setPassword('');
    }
  }, [user]);

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: any) => api.updateUser(userId, data),
    onSuccess: (updated) => {
      toast.success(`Profile for ${updated.firstName} ${updated.lastName} saved`);
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setPassword('');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update profile');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteUser(userId),
    onSuccess: () => {
      toast.success('User account deleted');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/users');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete user');
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: (data: any) => api.addUserAddress(userId, data),
    onSuccess: () => {
      toast.success('New address added to customer profile');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddressOpen(false);
      resetAddressForm();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add address');
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, data }: { addressId: string; data: any }) =>
      api.updateUserAddress(userId, addressId, data),
    onSuccess: () => {
      toast.success('Address updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingAddress(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update address');
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addrId: string) => api.deleteUserAddress(userId, addrId),
    onSuccess: () => {
      toast.success('Address removed');
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteAddrId(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete address');
    },
  });

  // Handlers
  const resetAddressForm = () => {
    setAddrTitle('Home');
    setAddrRecipient(`${user?.firstName || ''} ${user?.lastName || ''}`.trim());
    setAddrPhone(user?.phone || '');
    setAddrStreet('');
    setAddrCity('');
    setAddrProvince('');
    setAddrPostalCode('');
    setAddrDefaultShipping(false);
    setAddrDefaultBilling(false);
  };

  const handleOpenAddAddress = () => {
    resetAddressForm();
    setIsAddressOpen(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setEditAddrTitle(addr.title || 'Home');
    setEditAddrRecipient(addr.recipientName || '');
    setEditAddrPhone(addr.phone || '');
    setEditAddrStreet(addr.street || '');
    setEditAddrCity(addr.city || '');
    setEditAddrProvince(addr.province || '');
    setEditAddrPostalCode(addr.postalCode || '');
    setEditAddrDefaultShipping(addr.isDefaultShipping ?? false);
    setEditAddrDefaultBilling(addr.isDefaultBilling ?? false);
  };

  const handleEditAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    if (!editAddrStreet.trim() || !editAddrCity.trim() || !editAddrRecipient.trim()) {
      toast.error('Recipient, street address, and city are required');
      return;
    }

    updateAddressMutation.mutate({
      addressId: editingAddress.id,
      data: {
        title: editAddrTitle.trim() || 'Home',
        recipientName: editAddrRecipient.trim(),
        phone: editAddrPhone.trim(),
        street: editAddrStreet.trim(),
        city: editAddrCity.trim(),
        province: editAddrProvince.trim() || 'N/A',
        postalCode: editAddrPostalCode.trim() || 'N/A',
        isDefaultShipping: editAddrDefaultShipping,
        isDefaultBilling: editAddrDefaultBilling,
      },
    });
  };

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('First name, last name, and email are required');
      return;
    }
    const payload: any = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      role,
      isActive,
    };

    if (password.trim()) {
      payload.password = password.trim();
    }

    updateMutation.mutate(payload);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim() || !addrRecipient.trim()) {
      toast.error('Recipient, street address, and city are required');
      return;
    }

    addAddressMutation.mutate({
      title: addrTitle.trim() || 'Home',
      recipientName: addrRecipient.trim(),
      phone: addrPhone.trim(),
      street: addrStreet.trim(),
      city: addrCity.trim(),
      province: addrProvince.trim() || 'N/A',
      postalCode: addrPostalCode.trim() || 'N/A',
      isDefaultShipping: addrDefaultShipping,
      isDefaultBilling: addrDefaultBilling,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="space-y-8 pb-16">
        <Header title="User Profile Details" />
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 text-center">
          <p className="text-sm text-muted-foreground">Loading customer profile and addresses...</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-8 pb-16">
        <Header title="User Not Found" />
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24 text-center space-y-4">
          <p className="text-base text-destructive font-semibold">
            {error instanceof Error ? error.message : 'User account could not be found'}
          </p>
          <Button asChild variant="outline">
            <Link href="/users">← Back to Users</Link>
          </Button>
        </div>
      </div>
    );
  }

  const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || ''}`.toUpperCase();
  const addressList = user.addresses || [];

  return (
    <div className="space-y-8 pb-20">
      <Header title={`User: ${user.firstName} ${user.lastName}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        {/* Streamlined User Header */}
        <div className="p-3.5 sm:p-5 rounded-xl border border-border bg-card shadow-xs space-y-3">
          {/* Top row: Back link + Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <Link
              href="/users"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Users</span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete User</span>
                <span className="sm:hidden">Delete</span>
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveProfile()}
                disabled={updateMutation.isPending}
                className="gap-1.5 text-xs h-8 sm:h-9 px-3 sm:px-4 shadow-xs font-semibold"
              >
                <Save className="w-3.5 h-3.5" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>

          {/* Bottom row: Title, Badges, and Email / Phone info */}
          <div className="pt-2.5 border-t border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-wood-200 dark:bg-wood-950 text-wood-900 dark:text-wood-200 text-xs font-bold flex items-center justify-center shrink-0 border border-wood-300">
                {initials}
              </div>
              <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight truncate max-w-[260px] sm:max-w-md">
                {user.firstName} {user.lastName}
              </h1>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                {user.role === 'ADMIN' ? 'Admin' : 'Customer'}
              </Badge>
              {user.isActive ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Account
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-destructive/10 text-destructive border border-destructive/20 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  Suspended
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground font-mono shrink-0">
              <span>Email: <strong className="text-foreground">{user.email}</strong></span>
              {user.phone && (
                <>
                  <span>•</span>
                  <span>{user.phone}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Segmented Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full h-auto p-1.5 bg-muted/80 rounded-xl border border-border gap-1">
            <TabsTrigger value="profile" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <UserCheck className="w-3.5 h-3.5 shrink-0 text-primary" />
              <span>Account & Profile</span>
            </TabsTrigger>

            <TabsTrigger value="addresses" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-wood-700" />
              <span>Delivery & Addresses</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-wood-200 text-wood-900 rounded-full font-bold">
                {addressList.length}
              </span>
            </TabsTrigger>

            <TabsTrigger value="security" className="gap-2 py-2 text-xs font-semibold rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>Security & Insights</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Profile & Credentials */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-primary" />
                  <span>Profile Information & Role</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Modify customer contact information, administrative privileges, and password.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-5">
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">First Name *</label>
                      <Input
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Last Name *</label>
                      <Input
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Email Address *</label>
                      <Input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Phone Number</label>
                      <Input
                        placeholder="+1 555-0192"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-semibold text-foreground">Access Role</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('CUSTOMER')}
                        className={cn(
                          'p-3 rounded-xl border text-left flex items-start gap-3 transition-all',
                          role === 'CUSTOMER'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                            : 'border-border/80 hover:bg-muted/40 text-muted-foreground',
                        )}
                      >
                        <UserCheck
                          className={cn('w-4 h-4 shrink-0 mt-0.5', role === 'CUSTOMER' ? 'text-primary' : 'text-muted-foreground')}
                        />
                        <div>
                          <p className="text-xs font-semibold text-foreground">Customer</p>
                          <p className="text-[11px] text-muted-foreground">Standard store shopper with saved addresses.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('ADMIN')}
                        className={cn(
                          'p-3 rounded-xl border text-left flex items-start gap-3 transition-all',
                          role === 'ADMIN'
                            ? 'border-primary bg-primary/5 ring-1 ring-primary text-foreground'
                            : 'border-border/80 hover:bg-muted/40 text-muted-foreground',
                        )}
                      >
                        <ShieldCheck
                          className={cn('w-4 h-4 shrink-0 mt-0.5', role === 'ADMIN' ? 'text-primary' : 'text-muted-foreground')}
                        />
                        <div>
                          <p className="text-xs font-semibold text-foreground">Store Administrator</p>
                          <p className="text-[11px] text-muted-foreground">Full access to manage products, orders, and settings.</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Security Reset Password */}
                  <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2 pt-3">
                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-primary" />
                      Reset Account Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter new password (min 6 characters) or leave blank to keep unchanged"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="text-xs bg-background"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Only enter a value if you wish to override and change this user&apos;s current password.
                    </p>
                  </div>

                  <div className="flex justify-end pt-3">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="gap-1.5 font-semibold w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      {updateMutation.isPending ? 'Saving Profile...' : 'Save Profile Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Delivery & Billing Addresses */}
          <TabsContent value="addresses" className="space-y-6">
            <Card className="border-border/80 shadow-xs">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-wood-700 dark:text-wood-300" />
                    <span>Saved Delivery & Billing Locations ({addressList.length})</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Shipping destinations and invoice billing addresses for furniture orders.
                  </CardDescription>
                </div>

                <Button
                  onClick={handleOpenAddAddress}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1 font-medium self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </Button>
              </CardHeader>

              <CardContent className="pt-4">
                {addressList.length === 0 ? (
                  <div className="py-12 text-center border border-dashed rounded-xl space-y-3 bg-muted/10 p-4">
                    <MapPin className="w-10 h-10 text-muted-foreground opacity-40 mx-auto" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">No saved addresses</p>
                      <p className="text-xs text-muted-foreground">
                        No delivery or billing addresses have been added for this customer yet.
                      </p>
                    </div>
                    <Button
                      onClick={handleOpenAddAddress}
                      variant="outline"
                      size="sm"
                      className="text-xs gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add First Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {addressList.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleOpenEditAddress(addr)}
                        className="p-3.5 rounded-xl border border-border/80 bg-card hover:border-primary/50 transition-all flex flex-col justify-between space-y-3 cursor-pointer group shadow-2xs"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                              {addr.title.toLowerCase().includes('office') ? (
                                <Building className="w-3.5 h-3.5 text-primary" />
                              ) : (
                                <Home className="w-3.5 h-3.5 text-primary" />
                              )}
                              <span>{addr.title}</span>
                              <span className="text-[10px] text-muted-foreground font-normal ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                (click to edit)
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditAddress(addr);
                                }}
                                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition-colors"
                                title="Edit address"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteAddrId(addr.id);
                                }}
                                className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors"
                                title="Delete address"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-foreground font-medium">
                            {addr.recipientName}
                          </div>

                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <p>{addr.street}</p>
                            <p>
                              {addr.city}, {addr.province} {addr.postalCode}
                            </p>
                            <p className="font-mono text-[11px] pt-1">{addr.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/40">
                          {addr.isDefaultShipping && (
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400">
                              Default Shipping
                            </Badge>
                          )}
                          {addr.isDefaultBilling && (
                            <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400">
                              Default Billing
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Security & Insights */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Metadata Card */}
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>Account Metadata</span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-4 space-y-3.5 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Account ID (UUID)</span>
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      <span className="font-mono text-[11px] text-foreground truncate">{user.id}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(user.id, 'User ID')}
                        className="text-muted-foreground hover:text-foreground p-1 shrink-0"
                        title="Copy User ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <span className="text-muted-foreground block text-[11px]">Member Since</span>
                    <span className="font-medium text-foreground block pt-0.5">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>

                  {user.updatedAt && (
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-muted-foreground block text-[11px]">Last Profile Update</span>
                      <span className="font-medium text-foreground block pt-0.5">
                        {formatDate(user.updatedAt)}
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-border/60">
                    <span className="text-muted-foreground block text-[11px]">Saved Addresses</span>
                    <span className="font-bold text-foreground block pt-0.5">
                      {addressList.length} locations
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <span className="text-muted-foreground block text-[11px]">Authored Blog Posts</span>
                    <span className="font-bold text-foreground block pt-0.5">
                      {user._count?.blogPosts || 0} articles
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status & Danger Zone Card */}
              <div className="space-y-6">
                <Card className="border-border/80 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-primary" />
                      <span>Account Status & Permissions</span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Manage user login status and platform access privileges.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-border bg-muted/20">
                      <div>
                        <p className="font-semibold text-foreground">
                          {user.isActive ? 'Account Active' : 'Account Suspended'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {user.isActive
                            ? 'User can sign in and complete checkout orders.'
                            : 'User is blocked from signing in to this store.'}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant={user.isActive ? 'outline' : 'default'}
                        size="sm"
                        className={cn(
                          'text-xs font-semibold gap-1.5 shrink-0',
                          user.isActive && 'text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50',
                        )}
                        onClick={() => {
                          const nextState = !user.isActive;
                          setIsActive(nextState);
                          updateMutation.mutate({ isActive: nextState });
                        }}
                        disabled={updateMutation.isPending}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900/50 shadow-xs bg-red-50/20 dark:bg-red-950/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Permanently remove this user account, profiles, and associated addresses.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5 font-semibold text-xs"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete User Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ADD ADDRESS MODAL */}
      <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
        <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader className="pr-6">
            <DialogTitle>Add Delivery / Billing Address</DialogTitle>
            <DialogDescription>
              Record a new furniture delivery address for {user.firstName} {user.lastName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddressSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Address Label *</label>
                <Input
                  required
                  placeholder="e.g., Home, Summer Residence, Studio"
                  value={addrTitle}
                  onChange={(e) => setAddrTitle(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Recipient Full Name *</label>
                <Input
                  required
                  placeholder="e.g., Alexander Wright"
                  value={addrRecipient}
                  onChange={(e) => setAddrRecipient(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Contact Phone *</label>
                <Input
                  required
                  placeholder="+1 555-0192"
                  value={addrPhone}
                  onChange={(e) => setAddrPhone(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Postal / Zip Code</label>
                <Input
                  placeholder="97201"
                  value={addrPostalCode}
                  onChange={(e) => setAddrPostalCode(e.target.value)}
                  className="text-xs w-full font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Street Address *</label>
              <Input
                required
                placeholder="742 Evergreen Terrace, Apt 4B"
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                className="text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">City *</label>
                <Input
                  required
                  placeholder="Portland"
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Province / State</label>
                <Input
                  placeholder="Oregon"
                  value={addrProvince}
                  onChange={(e) => setAddrProvince(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={addrDefaultShipping}
                  onChange={(e) => setAddrDefaultShipping(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-foreground font-medium">Set as default shipping destination</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={addrDefaultBilling}
                  onChange={(e) => setAddrDefaultBilling(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-foreground font-medium">Set as default invoice billing address</span>
              </label>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsAddressOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addAddressMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {addAddressMutation.isPending ? 'Saving Address...' : 'Save Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT ADDRESS MODAL */}
      <Dialog open={Boolean(editingAddress)} onOpenChange={(open) => !open && setEditingAddress(null)}>
        <DialogContent className="sm:max-w-lg w-[calc(100vw-1.5rem)] max-h-[88dvh] overflow-x-hidden overflow-y-auto overscroll-contain">
          <DialogHeader className="pr-6">
            <DialogTitle>Edit Delivery / Billing Address</DialogTitle>
            <DialogDescription>
              Update address information for {user.firstName} {user.lastName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditAddressSubmit} className="space-y-4 pt-1 w-full min-w-0 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Address Label *</label>
                <Input
                  required
                  placeholder="e.g., Home, Summer Residence, Studio"
                  value={editAddrTitle}
                  onChange={(e) => setEditAddrTitle(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Recipient Full Name *</label>
                <Input
                  required
                  placeholder="e.g., Alexander Wright"
                  value={editAddrRecipient}
                  onChange={(e) => setEditAddrRecipient(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Contact Phone *</label>
                <Input
                  required
                  placeholder="+1 555-0192"
                  value={editAddrPhone}
                  onChange={(e) => setEditAddrPhone(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Postal / Zip Code</label>
                <Input
                  placeholder="97201"
                  value={editAddrPostalCode}
                  onChange={(e) => setEditAddrPostalCode(e.target.value)}
                  className="text-xs w-full font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <label className="text-xs font-semibold text-foreground">Street Address *</label>
              <Input
                required
                placeholder="742 Evergreen Terrace, Apt 4B"
                value={editAddrStreet}
                onChange={(e) => setEditAddrStreet(e.target.value)}
                className="text-xs w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">City *</label>
                <Input
                  required
                  placeholder="Portland"
                  value={editAddrCity}
                  onChange={(e) => setEditAddrCity(e.target.value)}
                  className="text-xs w-full"
                />
              </div>

              <div className="space-y-1.5 min-w-0">
                <label className="text-xs font-semibold text-foreground">Province / State</label>
                <Input
                  placeholder="Oregon"
                  value={editAddrProvince}
                  onChange={(e) => setEditAddrProvince(e.target.value)}
                  className="text-xs w-full"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={editAddrDefaultShipping}
                  onChange={(e) => setEditAddrDefaultShipping(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-foreground font-medium">Set as default shipping destination</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={editAddrDefaultBilling}
                  onChange={(e) => setEditAddrDefaultBilling(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-foreground font-medium">Set as default invoice billing address</span>
              </label>
            </div>

            <DialogFooter className="pt-2 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setEditingAddress(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAddressMutation.isPending}
                className="w-full sm:w-auto font-semibold"
              >
                {updateAddressMutation.isPending ? 'Saving Changes...' : 'Save Address Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE ADDRESS MODAL */}
      <Dialog open={Boolean(deleteAddrId)} onOpenChange={() => setDeleteAddrId(null)}>
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Remove Saved Address?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm pt-1">
              Are you sure you want to remove this delivery address from {user.firstName}&apos;s account?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteAddrId(null)}
              disabled={deleteAddressMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              className="w-full sm:w-auto font-semibold"
              onTrigger={() => deleteAddrId && deleteAddressMutation.mutate(deleteAddrId)}
              isPending={deleteAddressMutation.isPending}
              label="Remove Address"
              pendingLabel="Removing..."
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE USER MODAL */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md w-[calc(100vw-1.5rem)]">
          <DialogHeader className="pr-6">
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              Delete Account &quot;{user.firstName} {user.lastName}&quot;?
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-1 text-xs sm:text-sm">
              <p>
                Are you sure you want to permanently delete this user account?
              </p>
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive space-y-1 text-xs">
                <p className="font-semibold flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Irreversible Action Warning:
                </p>
                <p>
                  This action will permanently delete all {addressList.length} saved delivery addresses and erase customer login access.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 w-full min-w-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <HoldToDeleteButton
              className="w-full sm:w-auto font-semibold"
              onTrigger={() => deleteMutation.mutate()}
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
