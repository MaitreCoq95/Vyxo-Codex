/**
 * Vyxo Finance Hub - Top Products Table
 * Table des produits les plus rentables
 */

'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { UnitEconomicsAnalysis } from '@/types/finance'

interface TopProductsTableProps {
  products: UnitEconomicsAnalysis[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucune donnée produit disponible
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">#</TableHead>
          <TableHead>Produit</TableHead>
          <TableHead className="text-right">Unités</TableHead>
          <TableHead className="text-right">CA</TableHead>
          <TableHead className="text-right">Marge Contrib.</TableHead>
          <TableHead className="text-right">Marge Nette</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.product_name}>
            <TableCell className="font-medium">
              {product.profitability_rank}
            </TableCell>
            <TableCell>
              <div className="font-medium">{product.product_name}</div>
            </TableCell>
            <TableCell className="text-right">
              {product.units_sold.toLocaleString()}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(product.revenue)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {product.contribution_margin_pct > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span
                  className={
                    product.contribution_margin_pct > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {product.contribution_margin_pct.toFixed(1)}%
                </span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <span
                className={
                  product.net_margin_pct > 0
                    ? 'text-green-600 font-medium'
                    : 'text-red-600 font-medium'
                }
              >
                {product.net_margin_pct.toFixed(1)}%
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
