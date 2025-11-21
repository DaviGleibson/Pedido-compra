import { PurchaseOrder } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './status-badge';
import { Eye, Pencil, Trash2, Building2, User } from 'lucide-react';

interface OrderCardProps {
  order: PurchaseOrder;
  onView: (order: PurchaseOrder) => void;
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (order: PurchaseOrder) => void;
}

export function OrderCard({ order, onView, onEdit, onDelete }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-slate-200 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900">{order.orderNumber}</h3>
            <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Fornecedor:</span>
            <span className="font-medium text-slate-900">{order.supplier.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Comprador:</span>
            <span className="font-medium text-slate-900">{order.buyer.name}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-600">Valor Total</span>
            <span className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView(order)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(order)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(order)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
