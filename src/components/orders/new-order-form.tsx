'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ProductLineItems } from './product-line-items';
import { mockCompanies, mockSuppliers } from '@/lib/mock-data';
import { ProductLineItem, PaymentTerms, PaymentType } from '@/types';
import { Loader2 } from 'lucide-react';

interface NewOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function NewOrderForm({ open, onOpenChange, onSuccess }: NewOrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [companyId, setCompanyId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerDepartment, setBuyerDepartment] = useState('');
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerms>('net_30');
  const [paymentType, setPaymentType] = useState<PaymentType>('credit_card');
  const [lineItems, setLineItems] = useState<ProductLineItem[]>([
    {
      id: '1',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    },
  ]);

  const loggedUser = 'Sarah Johnson'; // Mock logged user

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const { subtotal, tax, total } = calculateTotals();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      onSuccess();
      // Reset form
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCompanyId('');
    setSupplierId('');
    setBuyerName('');
    setBuyerEmail('');
    setBuyerPhone('');
    setBuyerDepartment('');
    setPaymentTerms('net_30');
    setPaymentType('credit_card');
    setLineItems([
      {
        id: '1',
        productName: '',
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return companyId !== '';
      case 2:
        return supplierId !== '';
      case 3:
        return buyerName && buyerEmail && buyerPhone && buyerDepartment;
      case 4:
        return true; // Logged user is read-only
      case 5:
        return paymentTerms && paymentType;
      case 6:
        return lineItems.length > 0 && lineItems.every(item => 
          item.productName && item.quantity > 0 && item.unitPrice > 0
        );
      default:
        return false;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Criar Novo Pedido de Compra</SheetTitle>
        </SheetHeader>

        <form onSubmit={(e) => handleSubmit(e, false)} className="mt-6 space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === currentStep
                      ? 'bg-indigo-600 text-white'
                      : step < currentStep
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {step}
                </div>
                {step < 6 && (
                  <div
                    className={`h-1 w-8 ${
                      step < currentStep ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Company */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Selecionar Empresa Emissora</h3>
                <Label htmlFor="company">Empresa *</Label>
                <Select value={companyId} onValueChange={setCompanyId}>
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Selecione uma empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Supplier */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Selecionar Fornecedor</h3>
                <Label htmlFor="supplier">Fornecedor *</Label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Selecione um fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Buyer */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Informações do Comprador</h3>
              <div className="space-y-2">
                <Label htmlFor="buyerName">Nome *</Label>
                <Input
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="João Silva"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerEmail">E-mail *</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  placeholder="joao.silva@empresa.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerPhone">Telefone *</Label>
                <Input
                  id="buyerPhone"
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="+55 (11) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerDepartment">Departamento *</Label>
                <Input
                  id="buyerDepartment"
                  value={buyerDepartment}
                  onChange={(e) => setBuyerDepartment(e.target.value)}
                  placeholder="Operações"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Logged User */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Criado Por</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <Label className="text-sm text-slate-600">Usuário Logado</Label>
                <p className="text-lg font-medium text-slate-900 mt-1">{loggedUser}</p>
              </div>
            </div>
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Informações de Pagamento</h3>
              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Termos de Pagamento *</Label>
                <Select value={paymentTerms} onValueChange={(value) => setPaymentTerms(value as PaymentTerms)}>
                  <SelectTrigger id="paymentTerms">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net_30">Líquido 30</SelectItem>
                    <SelectItem value="net_60">Líquido 60</SelectItem>
                    <SelectItem value="net_90">Líquido 90</SelectItem>
                    <SelectItem value="due_on_receipt">Vencimento na Recepção</SelectItem>
                    <SelectItem value="prepaid">Pré-pago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Tipo de Pagamento *</Label>
                <Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}>
                  <SelectTrigger id="paymentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                    <SelectItem value="check">Cheque</SelectItem>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 6: Line Items */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <ProductLineItems items={lineItems} onChange={setLineItems} />
              
              <Separator />

              {/* Totals */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Imposto (10%)</span>
                  <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Anterior
              </Button>
            )}
            
            {currentStep < 6 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceedToNextStep()}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                Próximo
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting || !canProceedToNextStep()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar como Rascunho'
                  )}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !canProceedToNextStep()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar Pedido'
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
