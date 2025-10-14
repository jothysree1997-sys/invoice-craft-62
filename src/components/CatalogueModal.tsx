import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Grid, List } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Catalogue {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

interface CatalogueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectProduct: (product: Product) => void;
}

// Sample catalogue data
const catalogues: Catalogue[] = [
  {
    id: '1',
    name: 'Office Supplies',
    description: 'Essential office items',
    products: [
      { id: '1', name: 'Notebook A4', description: 'Premium quality notebook', price: 150 },
      { id: '2', name: 'Pen Set', description: 'Ball point pens - pack of 10', price: 200 },
      { id: '3', name: 'Stapler', description: 'Heavy duty stapler', price: 350 },
    ],
  },
  {
    id: '2',
    name: 'Electronics',
    description: 'Tech products and accessories',
    products: [
      { id: '4', name: 'USB Cable', description: 'Type-C 2m cable', price: 500 },
      { id: '5', name: 'Mouse Pad', description: 'Gaming mouse pad', price: 800 },
      { id: '6', name: 'Keyboard Cover', description: 'Silicone keyboard protector', price: 300 },
    ],
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Office furniture items',
    products: [
      { id: '7', name: 'Desk Lamp', description: 'LED desk lamp with dimmer', price: 2500 },
      { id: '8', name: 'Chair Cushion', description: 'Ergonomic chair cushion', price: 1800 },
      { id: '9', name: 'Monitor Stand', description: 'Adjustable monitor riser', price: 3200 },
    ],
  },
];

export function CatalogueModal({ open, onOpenChange, onSelectProduct }: CatalogueModalProps) {
  const [selectedCatalogue, setSelectedCatalogue] = useState<Catalogue | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const handleProductSelect = (product: Product) => {
    onSelectProduct(product);
    onOpenChange(false);
    setSelectedCatalogue(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {selectedCatalogue ? selectedCatalogue.name : 'Select Catalogue'}
          </DialogTitle>
          <DialogDescription>
            {selectedCatalogue
              ? 'Choose a product to add to your invoice'
              : 'Browse catalogues and select products'}
          </DialogDescription>
        </DialogHeader>

        {!selectedCatalogue ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {catalogues.map((catalogue) => (
              <Card
                key={catalogue.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedCatalogue(catalogue)}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{catalogue.name}</CardTitle>
                  </div>
                  <CardDescription>{catalogue.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {catalogue.products.length} products
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setSelectedCatalogue(null)}
              >
                ← Back to Catalogues
              </Button>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCatalogue.products.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleProductSelect(product)}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold text-primary">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCatalogue.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell className="text-right">
                        ₹{product.price.toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleProductSelect(product)}
                        >
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
