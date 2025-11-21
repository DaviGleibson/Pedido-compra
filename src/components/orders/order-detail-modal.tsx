import { PurchaseOrder } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from './status-badge';
import { Separator } from '@/components/ui/separator';
import { Building2, User, CreditCard, Calendar } from 'lucide-react';

interface OrderDetailModalProps {
  order: PurchaseOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailModal({ order, open, onOpenChange }: OrderDetailModalProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const paymentTermsLabels = {
    net_30: 'Líquido 30',
    net_60: 'Líquido 60',
    net_90: 'Líquido 90',
    due_on_receipt: 'Vencimento na Recepção',
    prepaid: 'Pré-pago',
  };

  const paymentTypeLabels = {
    credit_card: 'Cartão de Crédito',
    bank_transfer: 'Transferência Bancária',
    check: 'Cheque',
    cash: 'Dinheiro',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{order.orderNumber}</DialogTitle>
            <StatusBadge status={order.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company & Supplier Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 className="h-4 w-4" />
                Empresa Emissora
              </div>
              <div className="bg-slate-50 rounded-lg p-4 space-y-1">
                <p className="font-medium text-slate-900">{order.issuingCompany.name}</p>
                <p className="text-sm text-slate-600">{order.issuingCompany.address}</p>
                <p className="text-sm text-slate-600">{order.issuingCompany.email}</p>
                <p className="text-sm text-slate-600">{order.issuingCompany.phone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Building2 className="h-4 w-4" />
                Fornecedor
              </div>
              <div className="bg-slate-50 rounded-lg p-4 space-y-1">
                <p className="font-medium text-slate-900">{order.supplier.name}</p>
                <p className="text-sm text-slate-600">{order.supplier.address}</p>
                <p className="text-sm text-slate-600">{order.supplier.email}</p>
                <p className="text-sm text-slate-600">{order.supplier.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Buyer & Created By */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="h-4 w-4" />
                Informações do Comprador
              </div>
              <div className="bg-slate-50 rounded-lg p-4 space-y-1">
                <p className="font-medium text-slate-900">{order.buyer.name}</p>
                <p className="text-sm text-slate-600">{order.buyer.department}</p>
                <p className="text-sm text-slate-600">{order.buyer.email}</p>
                <p className="text-sm text-slate-600">{order.buyer.phone}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User className="h-4 w-4" />
                Criado Por
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-900">{order.createdBy}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CreditCard className="h-4 w-4" />
                Termos de Pagamento
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-900">{paymentTermsLabels[order.paymentTerms]}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <CreditCard className="h-4 w-4" />
                Tipo de Pagamento
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="font-medium text-slate-900">{paymentTypeLabels[order.paymentType]}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700">Itens do Pedido</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-slate-700">Produto</th>
                    <th className="text-right p-3 text-sm font-semibold text-slate-700">Qtd</th>
                    <th className="text-right p-3 text-sm font-semibold text-slate-700">Preço Unitário</th>
                    <th className="text-right p-3 text-sm font-semibold text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lineItems.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-3 text-sm text-slate-900">{item.productName}</td>
                      <td className="p-3 text-sm text-slate-900 text-right">{item.quantity}</td>
                      <td className="p-3 text-sm text-slate-900 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="p-3 text-sm font-medium text-slate-900 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium text-slate-900">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Imposto (10%)</span>
              <span className="font-medium text-slate-900">{formatCurrency(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="text-xl font-bold text-slate-900">{formatCurrency(order.total)}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>Criado em: {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>Atualizado em: {formatDate(order.updatedAt)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
