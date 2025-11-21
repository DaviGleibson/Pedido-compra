'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { OrderCard } from '@/components/orders/order-card';
import { OrderDetailModal } from '@/components/orders/order-detail-modal';
import { NewOrderForm } from '@/components/orders/new-order-form';
import { mockOrders } from '@/lib/mock-data';
import { PurchaseOrder, OrderStatus } from '@/types';
import { Plus, Search, ShoppingCart, LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (order: PurchaseOrder) => {
    // For now, just open the new order form
    // In a real app, this would populate the form with existing data
    setIsNewOrderOpen(true);
  };

  const handleDelete = (order: PurchaseOrder) => {
    setOrderToDelete(order);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter(o => o.id !== orderToDelete.id));
      setOrderToDelete(null);
    }
  };

  const handleLogout = () => {
    router.push('/');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = (status: OrderStatus) => {
    return orders.filter(o => o.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                PurchaseFlow
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Sarah Johnson</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Purchase Orders</h1>
          <p className="text-slate-600">Manage and track all your purchase orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total Orders</div>
            <div className="text-3xl font-bold text-slate-900">{orders.length}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-amber-600">{getStatusCount('pending')}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Approved</div>
            <div className="text-3xl font-bold text-blue-600">{getStatusCount('approved')}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Completed</div>
            <div className="text-3xl font-bold text-emerald-600">{getStatusCount('completed')}</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by order number, supplier, or buyer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsNewOrderOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </div>

        {/* Orders Grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-12 border border-slate-200 text-center">
            <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first purchase order'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                onClick={() => setIsNewOrderOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Order
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
      />

      <NewOrderForm
        open={isNewOrderOpen}
        onOpenChange={setIsNewOrderOpen}
        onSuccess={() => {
          // In a real app, refresh the orders list
          console.log('Order created successfully');
        }}
      />

      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order {orderToDelete?.orderNumber}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
