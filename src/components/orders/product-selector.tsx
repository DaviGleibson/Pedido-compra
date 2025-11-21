'use client';

import { useState, useMemo } from 'react';
import { Product, ProductLineItem, Brand, Category } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ShoppingCart, Plus, Minus } from 'lucide-react';
import { mockProducts, mockBrands, mockCategories } from '@/lib/mock-data';

interface ProductSelectorProps {
  selectedItems: ProductLineItem[];
  onAddProduct: (product: Product, quantity: number) => void;
  onUpdateQuantity: (productCode: number, quantity: number) => void;
  onRemoveProduct: (productCode: number) => void;
}

export function ProductSelector({
  selectedItems,
  onAddProduct,
  onUpdateQuantity,
  onRemoveProduct,
}: ProductSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'nome' | 'preco' | 'marca'>('nome');
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});

  // Filtrar produtos
  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.descricao.toLowerCase().includes(term) ||
          p.codigo.toString().includes(term) ||
          (p.gtin && p.gtin.includes(term)) ||
          p.marca_descricao.toLowerCase().includes(term)
      );
    }

    // Filtro por marca
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.marca_descricao));
    }

    // Filtro por categoria
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.grupo_id.toString() === selectedCategory);
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'preco':
          return a.valor_unitario - b.valor_unitario;
        case 'marca':
          return a.marca_descricao.localeCompare(b.marca_descricao);
        case 'nome':
        default:
          return a.descricao.localeCompare(b.descricao);
      }
    });

    return filtered;
  }, [searchTerm, selectedBrands, selectedCategory, sortBy]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleAddToOrder = (product: Product) => {
    const quantity = productQuantities[product.codigo] || 1;
    if (quantity > 0 && quantity <= product.estoque_disponivel) {
      onAddProduct(product, quantity);
      setProductQuantities({ ...productQuantities, [product.codigo]: 0 });
    }
  };

  const handleQuantityChange = (productCode: number, delta: number) => {
    const current = productQuantities[productCode] || 0;
    const product = mockProducts.find((p) => p.codigo === productCode);
    if (product) {
      const estoqueFardos = Math.floor(product.estoque_disponivel / product.qtd_por_caixa);
      const newQuantity = Math.max(0, Math.min(estoqueFardos, current + delta));
      setProductQuantities({ ...productQuantities, [productCode]: newQuantity });
    }
  };

  const handleQuantityInput = (productCode: number, value: string) => {
    const product = mockProducts.find((p) => p.codigo === productCode);
    if (product) {
      const estoqueFardos = Math.floor(product.estoque_disponivel / product.qtd_por_caixa);
      const quantity = Math.max(0, Math.min(estoqueFardos, parseInt(value) || 0));
      setProductQuantities({ ...productQuantities, [productCode]: quantity });
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const isProductInOrder = (productCode: number) => {
    return selectedItems.some((item) => item.productCode === productCode);
  };

  const getProductQuantityInOrder = (productCode: number) => {
    const item = selectedItems.find((item) => item.productCode === productCode);
    return item?.quantity || 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Selecionar Produtos</h3>
        <div className="text-sm text-slate-600">
          {filteredProducts.length} produto(s) encontrado(s)
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome, código, GTIN ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Filtro por Marca */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Marca</label>
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              <div className="space-y-1">
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBrands.length === 0}
                    onChange={() => setSelectedBrands([])}
                    className="rounded"
                  />
                  <span>Todas as marcas</span>
                </label>
                {mockBrands.map((brand) => (
                  <label key={brand.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.descricao)}
                      onChange={() => toggleBrand(brand.descricao)}
                      className="rounded"
                    />
                    <span>{brand.descricao}</span>
                  </label>
                ))}
              </div>
            </div>
            {selectedBrands.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1"
                  >
                    {brand}
                    <button
                      type="button"
                      onClick={() => toggleBrand(brand)}
                      className="hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Filtro por Categoria */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Categoria</label>
            <Select 
              value={selectedCategory || "all"} 
              onValueChange={(value) => setSelectedCategory(value === "all" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {mockCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ordenação */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Ordenar por</label>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nome">Nome</SelectItem>
                <SelectItem value="preco">Preço</SelectItem>
                <SelectItem value="marca">Marca</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto">
        {filteredProducts.map((product) => {
          const quantity = productQuantities[product.codigo] || 0;
          const inOrder = isProductInOrder(product.codigo);
          const orderQuantity = getProductQuantityInOrder(product.codigo);
          // Estoque já está em unidades, mas precisamos calcular em fardos/caixas
          const estoqueFardos = Math.floor(product.estoque_disponivel / product.qtd_por_caixa);
          const estoqueTotalFardos = Math.floor(product.estoqueAtual / product.qtd_por_caixa);

          return (
            <div
              key={product.codigo}
              className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
            >
              {/* Imagem ou Placeholder */}
              <div className="w-full h-32 bg-gradient-to-br from-blue-200 to-blue-400 rounded-lg mb-3 flex items-center justify-center">
                {product.tem_imagem ? (
                  <span className="text-white text-sm">Imagem</span>
                ) : (
                  <span className="text-white text-sm">Sem imagem</span>
                )}
              </div>

              {/* Informações do Produto */}
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">
                  {product.descricao}
                </h4>
                {product.gtin && (
                  <p className="text-xs text-slate-500">📊 GTIN: {product.gtin}</p>
                )}
                <p className="text-xs text-slate-600">
                  Código: {product.codigo} | {product.marca_descricao}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {formatCurrency(product.valor_caixa)} / {product.unidade_caixa}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  {estoqueFardos} {product.unidade_caixa} disponíveis
                </p>
                {product.estoque_reservado > 0 && (
                  <p className="text-xs text-yellow-600">
                    ({Math.floor(product.estoque_reservado / product.qtd_por_caixa)} reservados)
                  </p>
                )}
                <p className="text-xs text-slate-500">
                  {formatCurrency(product.valor_unitario)} por unidade
                </p>
              </div>

              {/* Controles de Quantidade */}
              {inOrder ? (
                <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-xs text-blue-800 mb-2">
                    Já no pedido: {orderQuantity} {product.unidade_caixa}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(product.codigo, orderQuantity - 1)}
                      disabled={orderQuantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium flex-1 text-center">
                      {orderQuantity}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const estoqueFardos = Math.floor(product.estoque_disponivel / product.qtd_por_caixa);
                        if (orderQuantity + 1 <= estoqueFardos) {
                          onUpdateQuantity(product.codigo, orderQuantity + 1);
                        }
                      }}
                      disabled={orderQuantity >= estoqueFardos}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveProduct(product.codigo)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product.codigo, -1)}
                      disabled={quantity <= 0}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      max={estoqueFardos}
                      value={quantity}
                      onChange={(e) => handleQuantityInput(product.codigo, e.target.value)}
                      className="flex-1 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(product.codigo, 1)}
                      disabled={quantity >= estoqueFardos}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleAddToOrder(product)}
                    disabled={quantity <= 0 || quantity > estoqueFardos}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          Nenhum produto encontrado com os filtros aplicados.
        </div>
      )}
    </div>
  );
}

