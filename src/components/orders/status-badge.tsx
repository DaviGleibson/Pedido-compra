import { OrderStatus } from '@/types';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    draft: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
    pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    approved: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
    completed: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  };

  const labels = {
    draft: 'Rascunho',
    pending: 'Pendente',
    approved: 'Aprovado',
    completed: 'Concluído',
  };

  return (
    <Badge className={variants[status]}>
      {labels[status]}
    </Badge>
  );
}
