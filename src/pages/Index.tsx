import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, Trash2, Save, Printer, Download, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CatalogueModal } from '@/components/CatalogueModal';

interface InvoiceItem {
  id: string;
  hsnCode: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

type InvoiceTheme = 'classic' | 'modern' | 'minimal';

const Index = () => {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<InvoiceTheme>('classic');
  const [isSaved, setIsSaved] = useState(false);
  const [showCatalogueModal, setShowCatalogueModal] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [from, setFrom] = useState('');
  const [proposalTo, setProposalTo] = useState('');
  const [shipTo, setShipTo] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [dueDate, setDueDate] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', hsnCode: '', description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [bankDetails, setBankDetails] = useState('');
  const [terms, setTerms] = useState('');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLineItem = () => {
    setItems([...items, { id: Date.now().toString(), hsnCode: '', description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const updateLineItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = Number(updated.quantity) * Number(updated.rate);
        }
        return updated;
      }
      return item;
    }));
  };

  const removeLineItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - discount + tax + shipping;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!from.trim()) newErrors.from = 'This field is required';
    if (!proposalTo.trim()) newErrors.proposalTo = 'This field is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setIsSaved(true);
    toast({
      title: 'Invoice Saved',
      description: 'Your invoice has been saved successfully.',
    });
  };

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const handleDownload = () => {
    handlePrint();
  };

  const handleProductSelect = (product: { name: string; description: string; price: number }) => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      hsnCode: '',
      description: product.name,
      quantity: 1,
      rate: product.price,
      amount: product.price,
    };
    setItems([...items, newItem]);
    toast({
      title: 'Product Added',
      description: `${product.name} has been added to the invoice.`,
    });
  };

  const themeClasses = {
    classic: 'bg-white text-gray-800',
    modern: 'bg-gradient-to-br from-blue-50 to-white text-gray-800',
    minimal: 'bg-white text-gray-900'
  };

  const headerClasses = {
    classic: 'bg-gray-100 border-b-2 border-gray-300',
    modern: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white',
    minimal: 'border-b border-gray-200'
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Invoice Generator</h1>
          <p className="text-sm text-muted-foreground">Create professional invoices in minutes</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice Form */}
          <div className="lg:col-span-2 no-print space-y-6">
            {/* Header Section - Two Column Layout */}
            <Card className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <Label>Company Logo</Label>
                    <div className="mt-2">
                      {logo ? (
                        <div className="relative w-40 h-40 border-2 border-dashed border-border rounded-lg p-2">
                          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                          <Button variant="destructive" size="sm" className="absolute -top-2 -right-2" onClick={() => setLogo(null)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center w-40 h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Add Logo</span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className={cn(errors.from && "text-destructive")}>
                      Who is this from? <span className="text-destructive">*</span>
                    </Label>
                    <Textarea value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your company name&#10;Address&#10;City, State ZIP" className={cn("mt-2 h-32", errors.from && "border-destructive")} />
                    {errors.from && <p className="text-sm text-destructive mt-1">{errors.from}</p>}
                  </div>

                  <div>
                    <Label className={cn(errors.proposalTo && "text-destructive")}>
                      Proposal To <span className="text-destructive">*</span>
                    </Label>
                    <Textarea value={proposalTo} onChange={(e) => setProposalTo(e.target.value)} placeholder="Client name&#10;Address&#10;City, State ZIP" className={cn("mt-2 h-32", errors.proposalTo && "border-destructive")} />
                    {errors.proposalTo && <p className="text-sm text-destructive mt-1">{errors.proposalTo}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Invoice #</Label>
                      <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="INV-001" />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>Payment Terms</Label>
                      <Input value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Net 30" />
                    </div>
                    <div>
                      <Label>Due Date</Label>
                      <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>
                    <div>
                      <Label>PO Number</Label>
                      <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} placeholder="PO-001" />
                    </div>
                  </div>

                  <div>
                    <Label>Ship To (Optional)</Label>
                    <Textarea value={shipTo} onChange={(e) => setShipTo(e.target.value)} placeholder="Shipping address&#10;City, State ZIP" className="mt-2 h-32" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Items Section */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Line Items</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 w-28">HSN Code</th>
                      <th className="text-left py-2 px-2">Description</th>
                      <th className="text-right py-2 px-2 w-24">Quantity</th>
                      <th className="text-right py-2 px-2 w-32">Rate (₹)</th>
                      <th className="text-right py-2 px-2 w-32">Amount (₹)</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-2">
                          <Input value={item.hsnCode} onChange={(e) => updateLineItem(item.id, 'hsnCode', e.target.value)} placeholder="HSN" className="border-0 focus-visible:ring-0" />
                        </td>
                        <td className="py-2 px-2">
                          <Input value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} placeholder="Item description" className="border-0 focus-visible:ring-0" />
                        </td>
                        <td className="py-2 px-2">
                          <Input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))} className="border-0 focus-visible:ring-0 text-right" min="0" />
                        </td>
                        <td className="py-2 px-2">
                          <Input type="number" value={item.rate} onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value))} className="border-0 focus-visible:ring-0 text-right" min="0" step="0.01" />
                        </td>
                        <td className="py-2 px-2 text-right font-medium">
                          ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-2">
                          <Button variant="ghost" size="sm" onClick={() => removeLineItem(item.id)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" onClick={addLineItem} className="flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Line Item
                </Button>
                <Button variant="outline" onClick={() => setShowCatalogueModal(true)} className="flex-1 sm:flex-none">
                  <Package className="h-4 w-4 mr-2" />
                  Catalogue Item
                </Button>
              </div>
            </Card>

            {/* Additional Charges */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Discount (₹)</Label>
                    <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min="0" step="0.01" />
                  </div>
                  <div>
                    <Label>Tax (₹)</Label>
                    <Input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} min="0" step="0.01" />
                  </div>
                  <div>
                    <Label>Shipping (₹)</Label>
                    <Input type="number" value={shipping} onChange={(e) => setShipping(Number(e.target.value))} min="0" step="0.01" />
                  </div>
                </div>
                <div className="flex items-end">
                  <div className="w-full space-y-2 text-right">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-medium">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Tax:</span>
                        <span className="font-medium">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {shipping > 0 && (
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="font-medium">₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t-2 border-border">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-bold text-primary">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Footer */}
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Bank Details</Label>
                  <Textarea value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} placeholder="Bank name&#10;Account number&#10;IFSC code" className="mt-2 h-32" />
                </div>
                <div>
                  <Label>Terms and Conditions</Label>
                  <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="Payment terms&#10;Delivery terms" className="mt-2 h-32" />
                </div>
              </div>
            </Card>
          </div>

          {/* Settings Sidebar */}
          <div className="no-print">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-6">Invoice Settings</h2>
              <div className="space-y-6">
                <div>
                  <Label>Theme</Label>
                  <Select value={theme} onValueChange={(value) => setTheme(value as InvoiceTheme)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Button onClick={handleSave} className="w-full bg-success hover:bg-success/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Invoice
                  </Button>
                  {isSaved && (
                    <>
                      <Button onClick={handlePrint} className="w-full bg-info hover:bg-info/90">
                        <Printer className="h-4 w-4 mr-2" />
                        Print Invoice
                      </Button>
                      <Button onClick={handleDownload} variant="secondary" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </>
                  )}
                </div>
                {!isSaved && (
                  <p className="text-sm text-muted-foreground text-center pt-4 border-t">
                    Save your invoice to unlock print and download options
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Preview */}
        {isSaved && (
          <div className="mt-12 no-print">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Invoice Preview</h2>
              <p className="text-sm text-muted-foreground">This is how your invoice will look when printed</p>
            </div>
            <div className="border-2 border-dashed border-border rounded-lg p-4 bg-card">
              <div ref={printRef} className={cn("w-full max-w-4xl mx-auto p-8 print:p-6", themeClasses[theme])}>
                <div className={cn("p-6 mb-6 rounded-lg", headerClasses[theme])}>
                  <div className="flex justify-between items-start">
                    <div>
                      {logo && <img src={logo} alt="Logo" className="h-16 mb-4 object-contain" />}
                      <h1 className={cn("text-3xl font-bold", theme === 'modern' ? 'text-white' : 'text-gray-800')}>INVOICE</h1>
                    </div>
                    <div className={cn("text-right", theme === 'modern' ? 'text-white' : 'text-gray-600')}>
                      <p className="font-semibold">Invoice #: {invoiceNumber}</p>
                      <p>Date: {date}</p>
                      {paymentTerms && <p>Payment Terms: {paymentTerms}</p>}
                      {dueDate && <p>Due Date: {dueDate}</p>}
                      {poNumber && <p>PO Number: {poNumber}</p>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">From:</h3>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{from || 'N/A'}</div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">To:</h3>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{proposalTo || 'N/A'}</div>
                  </div>
                  {shipTo && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">Ship To:</h3>
                      <div className="text-sm text-gray-600 whitespace-pre-line">{shipTo}</div>
                    </div>
                  )}
                </div>
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className={cn("border-b-2", theme === 'modern' ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50')}>
                        <th className="text-left py-3 px-4 font-semibold">HSN Code</th>
                        <th className="text-left py-3 px-4 font-semibold">Description</th>
                        <th className="text-right py-3 px-4 font-semibold">Qty</th>
                        <th className="text-right py-3 px-4 font-semibold">Rate (₹)</th>
                        <th className="text-right py-3 px-4 font-semibold">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className={cn("border-b", index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                          <td className="py-3 px-4">{item.hsnCode || '-'}</td>
                          <td className="py-3 px-4">{item.description}</td>
                          <td className="text-right py-3 px-4">{item.quantity}</td>
                          <td className="text-right py-3 px-4">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="text-right py-3 px-4 font-medium">{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mb-8">
                  <div className="w-80 space-y-2">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Tax:</span>
                        <span className="font-medium">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {shipping > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Shipping:</span>
                        <span className="font-medium">₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className={cn("flex justify-between py-3 border-t-2 mt-2", theme === 'modern' ? 'border-blue-300' : 'border-gray-300')}>
                      <span className="text-lg font-bold">Total:</span>
                      <span className={cn("text-xl font-bold", theme === 'modern' ? 'text-blue-600' : 'text-gray-800')}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
                {(bankDetails || terms) && (
                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-300">
                    {bankDetails && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Bank Details:</h3>
                        <div className="text-sm text-gray-600 whitespace-pre-line">{bankDetails}</div>
                      </div>
                    )}
                    {terms && (
                      <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Terms and Conditions:</h3>
                        <div className="text-sm text-gray-600 whitespace-pre-line">{terms}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <CatalogueModal
        open={showCatalogueModal}
        onOpenChange={setShowCatalogueModal}
        onSelectProduct={handleProductSelect}
      />
    </div>
  );
};

export default Index;
