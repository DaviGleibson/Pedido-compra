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
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Pedidos de Compra</h1>
          <p className="text-slate-600">Gerencie e acompanhe todos os seus pedidos de compra</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Total de Pedidos</div>
            <div className="text-3xl font-bold text-slate-900">{orders.length}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Pendentes</div>
            <div className="text-3xl font-bold text-amber-600">{getStatusCount('pending')}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Aprovados</div>
            <div className="text-3xl font-bold text-blue-600">{getStatusCount('approved')}</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
            <div className="text-sm text-slate-600 mb-1">Concluídos</div>
            <div className="text-3xl font-bold text-emerald-600">{getStatusCount('completed')}</div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por número do pedido, fornecedor ou comprador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setIsNewOrderOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Pedido
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
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Nenhum pedido encontrado</h3>
            <p className="text-slate-600 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Tente ajustar seus filtros'
                : 'Comece criando seu primeiro pedido de compra'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button
                onClick={() => setIsNewOrderOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Pedido
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
            <AlertDialogTitle>Excluir Pedido de Compra</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pedido {orderToDelete?.orderNumber}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
