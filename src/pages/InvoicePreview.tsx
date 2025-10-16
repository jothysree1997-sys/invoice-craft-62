import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface InvoiceItem {
  id: string;
  hsnCode: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  logo: string | null;
  from: string;
  proposalTo: string;
  shipTo: string;
  invoiceNumber: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  poNumber: string;
  items: InvoiceItem[];
  discount: number;
  tax: number;
  shipping: number;
  bankDetails: string;
  terms: string;
  theme: string;
}

const InvoicePreview = () => {
  const [searchParams] = useSearchParams();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam));
        setInvoiceData(data);
      } catch (error) {
        console.error('Error parsing invoice data:', error);
      }
    }
  }, [searchParams]);

  if (!invoiceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    );
  }

  const { logo, from, proposalTo, shipTo, invoiceNumber, date, paymentTerms, dueDate, poNumber, items, discount, tax, shipping, bankDetails, terms, theme } = invoiceData;
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal - discount + tax + shipping;

  const renderClassicTheme = () => (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-gray-800">
      <div className="p-6 mb-6 rounded-lg bg-gray-100 border-b-2 border-gray-300">
        <div className="flex justify-between items-start">
          <div>
            {logo && <img src={logo} alt="Logo" className="h-16 mb-4 object-contain" />}
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
          </div>
          <div className="text-right text-gray-600">
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
            <tr className="border-b-2 border-gray-300 bg-gray-50">
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
          <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold text-gray-800">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
  );

  const renderModernTheme = () => (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-white text-gray-800">
      <div className="p-6 mb-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="flex justify-between items-start">
          <div>
            {logo && <img src={logo} alt="Logo" className="h-16 mb-4 object-contain" />}
            <h1 className="text-3xl font-bold text-white">INVOICE</h1>
          </div>
          <div className="text-right text-white">
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
            <tr className="border-b-2 border-blue-300 bg-blue-50">
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
          <div className="flex justify-between py-3 border-t-2 border-blue-300 mt-2">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold text-blue-600">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
  );

  const renderMinimalTheme = () => (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-gray-900">
      <div className="p-6 mb-6 rounded-lg border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            {logo && <img src={logo} alt="Logo" className="h-16 mb-4 object-contain" />}
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
          </div>
          <div className="text-right text-gray-600">
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
            <tr className="border-b-2 border-gray-300 bg-gray-50">
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
          <div className="flex justify-between py-3 border-t-2 border-gray-300 mt-2">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-xl font-bold text-gray-800">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
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
  );

  const renderModernMinimalTheme = () => (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-gray-900">
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          {logo && <img src={logo} alt="Logo" className="h-20 mb-4 object-contain" />}
          <h1 className="text-4xl font-light text-gray-800 mb-6">INVOICE</h1>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">From</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{from || 'N/A'}</div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">To</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{proposalTo || 'N/A'}</div>
            </div>
          </div>
        </div>
        <div className="text-right space-y-3">
          <div>
            <p className="text-xs text-gray-500 uppercase">Invoice Number</p>
            <p className="text-lg font-semibold text-gray-800">{invoiceNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Date</p>
            <p className="text-sm text-gray-700">{date}</p>
          </div>
          {paymentTerms && (
            <div>
              <p className="text-xs text-gray-500 uppercase">Payment Terms</p>
              <p className="text-sm text-gray-700">{paymentTerms}</p>
            </div>
          )}
          {dueDate && (
            <div>
              <p className="text-xs text-gray-500 uppercase">Due Date</p>
              <p className="text-sm text-gray-700">{dueDate}</p>
            </div>
          )}
          {poNumber && (
            <div>
              <p className="text-xs text-gray-500 uppercase">PO Number</p>
              <p className="text-sm text-gray-700">{poNumber}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="text-left py-4 px-2 font-semibold text-sm">HSN</th>
              <th className="text-left py-4 px-2 font-semibold text-sm">Description</th>
              <th className="text-right py-4 px-2 font-semibold text-sm">Qty</th>
              <th className="text-right py-4 px-2 font-semibold text-sm">Rate</th>
              <th className="text-right py-4 px-2 font-semibold text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-4 px-2 text-sm">{item.hsnCode || '-'}</td>
                <td className="py-4 px-2 text-sm">{item.description}</td>
                <td className="text-right py-4 px-2 text-sm">{item.quantity}</td>
                <td className="text-right py-4 px-2 text-sm">₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td className="text-right py-4 px-2 text-sm font-medium">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-80">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between py-1 text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-red-600">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {tax > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Tax</span>
                <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            {shipping > 0 && (
              <div className="flex justify-between py-1 text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-900 text-white p-4 rounded">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-2xl font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {(bankDetails || terms) && (
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
          {bankDetails && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Bank Details</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{bankDetails}</div>
            </div>
          )}
          {terms && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Terms</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{terms}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderCorporateTheme = () => (
    <div className="w-full max-w-4xl mx-auto p-8 bg-gray-50 text-gray-900">
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-8 rounded-t-lg mb-0">
        <div className="flex justify-between items-start">
          <div>
            {logo && <img src={logo} alt="Logo" className="h-16 mb-3 object-contain brightness-0 invert" />}
            <h1 className="text-3xl font-bold">INVOICE</h1>
          </div>
          <div className="text-right bg-white/10 p-4 rounded">
            <p className="font-bold text-lg">#{invoiceNumber}</p>
            <p className="text-sm mt-1">{date}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 border-x border-gray-200">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-indigo-700 mb-2 text-sm uppercase">Billed From</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line">{from || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-indigo-700 mb-2 text-sm uppercase">Billed To</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line">{proposalTo || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold text-indigo-700 mb-2 text-sm uppercase">Details</h3>
            <div className="text-sm text-gray-700 space-y-1">
              {paymentTerms && <p>Terms: {paymentTerms}</p>}
              {dueDate && <p>Due: {dueDate}</p>}
              {poNumber && <p>PO: {poNumber}</p>}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-700 text-white">
                <th className="text-left py-3 px-4 font-semibold text-sm">HSN</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Qty</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Rate</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 text-sm">{item.hsnCode || '-'}</td>
                  <td className="py-3 px-4 text-sm">{item.description}</td>
                  <td className="text-right py-3 px-4 text-sm">{item.quantity}</td>
                  <td className="text-right py-3 px-4 text-sm">₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="text-right py-3 px-4 text-sm font-medium">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-8 border-x border-b border-gray-200 rounded-b-lg">
        <div className="flex justify-end">
          <div className="w-80 bg-indigo-50 p-6 rounded-lg">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Discount</span>
                  <span className="font-medium text-red-600">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Tax</span>
                  <span className="font-medium">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-4 border-t-2 border-indigo-700">
              <span className="text-lg font-bold text-indigo-700">Total</span>
              <span className="text-2xl font-bold text-indigo-700">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {(bankDetails || terms) && (
          <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200">
            {bankDetails && (
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2 text-sm uppercase">Bank Details</h3>
                <div className="text-sm text-gray-700 whitespace-pre-line">{bankDetails}</div>
              </div>
            )}
            {terms && (
              <div>
                <h3 className="font-semibold text-indigo-700 mb-2 text-sm uppercase">Terms</h3>
                <div className="text-sm text-gray-700 whitespace-pre-line">{terms}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCreativeTheme = () => (
    <div className="w-full max-w-4xl mx-auto bg-white text-gray-900 flex">
      <div className="w-64 bg-gradient-to-b from-purple-600 via-purple-500 to-pink-500 text-white p-8 flex-shrink-0">
        <div className="mb-8">
          {logo && <img src={logo} alt="Logo" className="h-16 mb-6 object-contain brightness-0 invert" />}
          <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
          <p className="text-purple-100 text-sm">#{invoiceNumber}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2 text-purple-100 text-xs uppercase">From</h3>
            <div className="text-sm whitespace-pre-line leading-relaxed">{from || 'N/A'}</div>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-purple-100 text-xs uppercase">Details</h3>
            <div className="text-sm space-y-1">
              <p>Date: {date}</p>
              {paymentTerms && <p>Terms: {paymentTerms}</p>}
              {dueDate && <p>Due: {dueDate}</p>}
              {poNumber && <p>PO: {poNumber}</p>}
            </div>
          </div>

          {bankDetails && (
            <div>
              <h3 className="font-semibold mb-2 text-purple-100 text-xs uppercase">Bank Details</h3>
              <div className="text-sm whitespace-pre-line leading-relaxed">{bankDetails}</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <h3 className="font-semibold text-purple-600 mb-2 text-sm uppercase">Billed To</h3>
          <div className="text-sm text-gray-700 whitespace-pre-line">{proposalTo || 'N/A'}</div>
          {shipTo && (
            <div className="mt-4">
              <h3 className="font-semibold text-purple-600 mb-1 text-sm uppercase">Ship To</h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">{shipTo}</div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
                <th className="text-left py-3 px-3 font-semibold text-xs">HSN</th>
                <th className="text-left py-3 px-3 font-semibold text-xs">Item</th>
                <th className="text-right py-3 px-3 font-semibold text-xs">Qty</th>
                <th className="text-right py-3 px-3 font-semibold text-xs">Rate</th>
                <th className="text-right py-3 px-3 font-semibold text-xs">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-purple-50' : 'bg-white'}>
                  <td className="py-3 px-3 text-sm">{item.hsnCode || '-'}</td>
                  <td className="py-3 px-3 text-sm">{item.description}</td>
                  <td className="text-right py-3 px-3 text-sm">{item.quantity}</td>
                  <td className="text-right py-3 px-3 text-sm">₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="text-right py-3 px-3 text-sm font-medium">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-6">
          <div className="w-72">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-600">-₹{discount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              {shipping > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Due</span>
                <span className="text-2xl font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {terms && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-purple-600 mb-2 text-sm uppercase">Terms</h3>
            <div className="text-sm text-gray-700 whitespace-pre-line">{terms}</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTheme = () => {
    switch (theme) {
      case 'classic':
        return renderClassicTheme();
      case 'modern':
        return renderModernTheme();
      case 'minimal':
        return renderMinimalTheme();
      case 'modern-minimal':
        return renderModernMinimalTheme();
      case 'corporate':
        return renderCorporateTheme();
      case 'creative':
        return renderCreativeTheme();
      default:
        return renderClassicTheme();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {renderTheme()}
    </div>
  );
};

export default InvoicePreview;
