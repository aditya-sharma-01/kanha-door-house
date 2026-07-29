import { useState } from 'react';
import { X, FileText, Save, Calculator } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';

export default function PurchaseModal({ purchase: initialPurchase, onClose, onSave }) {
  const [purchase, setPurchase] = useState(initialPurchase || {
    id: `PUR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    supplierName: 'Apex Aluminium Extrusions Pvt Ltd',
    supplierGSTIN: '10AAACA5541B1ZS',
    billNumber: `SUP-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    description: 'Raw Profile Bars & Glass Stock Purchase',
    hsn: '3925',
    taxableValue: 50000,
    cgstRate: 9,
    inputCGST: 4500,
    sgstRate: 9,
    inputSGST: 4500,
    totalAmount: 59000,
    paymentStatus: 'Paid'
  });

  const recalculateTax = (taxable, cgstR, sgstR) => {
    const tax = parseFloat(taxable) || 0;
    const cgst = Math.round((tax * (parseFloat(cgstR) || 0)) / 100);
    const sgst = Math.round((tax * (parseFloat(sgstR) || 0)) / 100);
    const total = tax + cgst + sgst;
    setPurchase(prev => ({
      ...prev,
      taxableValue: tax,
      cgstRate: cgstR,
      sgstRate: sgstR,
      inputCGST: cgst,
      inputSGST: sgst,
      totalAmount: total
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!purchase.supplierName || !purchase.billNumber) {
      alert('Please enter supplier name and bill number.');
      return;
    }
    onSave(purchase);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">{initialPurchase ? 'Edit Purchase Bill (ITC)' : 'Record Supplier Purchase (ITC)'}</h3>
              <p className="text-xs text-slate-400">ICAI & Indian GST Input Tax Credit Ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Name *</label>
              <input
                type="text"
                required
                value={purchase.supplierName}
                onChange={e => setPurchase({ ...purchase, supplierName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier GSTIN</label>
              <input
                type="text"
                value={purchase.supplierGSTIN}
                onChange={e => setPurchase({ ...purchase, supplierGSTIN: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono"
                placeholder="10AAAAA0000A1Z5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Invoice/Bill No *</label>
              <input
                type="text"
                required
                value={purchase.billNumber}
                onChange={e => setPurchase({ ...purchase, billNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Date</label>
              <input
                type="date"
                value={purchase.date}
                onChange={e => setPurchase({ ...purchase, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Description & Raw Materials</label>
            <input
              type="text"
              value={purchase.description}
              onChange={e => setPurchase({ ...purchase, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g. 50 UPVC Profile Bars & 200 sq ft Glass"
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="font-bold text-slate-800 text-xs uppercase tracking-wider">ICAI Taxable & ITC Calculation</div>
            
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Taxable Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={purchase.taxableValue}
                  onChange={e => recalculateTax(e.target.value, purchase.cgstRate || 9, purchase.sgstRate || 9)}
                  className="w-full px-2.5 py-1.5 border rounded-lg font-bold text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Input CGST (9%)</label>
                <input
                  type="number"
                  readOnly
                  value={purchase.inputCGST}
                  className="w-full px-2.5 py-1.5 border rounded-lg bg-slate-100 font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Input SGST (9%)</label>
                <input
                  type="number"
                  readOnly
                  value={purchase.inputSGST}
                  className="w-full px-2.5 py-1.5 border rounded-lg bg-slate-100 font-bold text-emerald-700"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-extrabold text-slate-900">
              <span>Total Bill Amount:</span>
              <span className="text-emerald-700 text-sm">₹{purchase.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg text-xs shadow-md"
            >
              <Save className="w-4 h-4 text-emerald-400" /> Save Purchase Bill
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
