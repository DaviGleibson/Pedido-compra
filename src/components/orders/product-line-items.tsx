'use client';

import { ProductLineItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';

interface ProductLineItemsProps {
  items: ProductLineItem[];
  onChange: (items: ProductLineItem[]) => void;
}

export function ProductLineItems({ items, onChange }: ProductLineItemsProps) {
  const addItem = () => {
    const newItem: ProductLineItem = {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ProductLineItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        // Auto-calculate total
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    onChange(updatedItems);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Itens do Pedido</h3>
        <Button type="button" onClick={addItem} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Adicionar Item
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left p-3 text-sm font-semibold text-slate-700">Nome do Produto</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700 w-24">Quantidade</th>
              <th className="text-left p-3 text-sm font-semibold text-slate-700 w-32">Preço Unitário</th>
              <th className="text-right p-3 text-sm font-semibold text-slate-700 w-32">Total</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={index > 0 ? 'border-t' : ''}>
                <td className="p-3">
                  <Input
                    value={item.productName}
                    onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                    placeholder="Digite o nome do produto"
                    required
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    required
                  />
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    required
                  />
                </td>
                <td className="p-3 text-right font-medium text-slate-900">
                  {formatCurrency(item.total)}
                </td>
                <td className="p-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="border rounded-lg p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Item {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nome do Produto</label>
              <Input
                value={item.productName}
                onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Quantidade</label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Preço Unitário</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total</span>
                <span className="text-lg font-bold text-slate-900">{formatCurrency(item.total)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Nenhum item adicionado ainda. Clique em "Adicionar Item" para começar.
        </div>
      )}
    </div>
  );
}
