import { useState } from 'react';
import { X, Plus, Trash2, Printer, Share2, Save, FileText } from 'lucide-react';
import { BUSINESS_INFO } from '../lib/types';
import { printGSTInvoice } from '../lib/pdfGenerator';

export default function GSTInvoiceModal({ invoice: initialInvoice, onClose, onSave }) {
  const [invoice, setInvoice] = useState(initialInvoice || {
    id: `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    items: [
      { description: 'UPVC Sliding 2-Track Window (5x4 ft, White Frame)', hsn: '3925', qty: 2, unitPrice: 9500, amount: 19000 }
    ],
    subtotal: 19000,
    cgstRate: 9,
    cgstAmount: 1710,
    sgstRate: 9,
    sgstAmount: 1710,
    igstRate: 0,
    igstAmount: 0,
    total: 22420,
    advancePaid: 10000,
    balanceDue: 12420,
    status: 'Partial Paid',
    paymentMode: 'UPI / Online',
    notes: 'Includes 5-Year Frame & Hardware Warranty by Kanha Door House.'
  });

  const updateItem = (index, field, value) => {
    const updatedItems = [...invoice.items];
    updatedItems[index][field] = value;
    if (field === 'qty' || field === 'unitPrice') {
      const q = parseFloat(updatedItems[index].qty) || 0;
      const p = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].amount = q * p;
    }
    recalculateTotals(updatedItems, invoice.cgstRate, invoice.sgstRate, invoice.igstRate, invoice.advancePaid);
  };

  const addItem = () => {
    const updatedItems = [
      ...invoice.items,
      { description: 'WPVC Waterproof Solid Door (7x3 ft)', hsn: '3925', qty: 1, unitPrice: 11500, amount: 11500 }
    ];
    recalculateTotals(updatedItems, invoice.cgstRate, invoice.sgstRate, invoice.igstRate, invoice.advancePaid);
  };

  const removeItem = (index) => {
    if (invoice.items.length === 1) return;
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    recalculateTotals(updatedItems, invoice.cgstRate, invoice.sgstRate, invoice.igstRate, invoice.advancePaid);
  };

  const recalculateTotals = (items, cgstR, sgstR, igstR, advance) => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const cgstAmt = Math.round((subtotal * (parseFloat(cgstR) || 0)) / 100);
    const sgstAmt = Math.round((subtotal * (parseFloat(sgstR) || 0)) / 100);
    const igstAmt = Math.round((subtotal * (parseFloat(igstR) || 0)) / 100);
    const total = subtotal + cgstAmt + sgstAmt + igstAmt;
    const adv = parseFloat(advance) || 0;
    const balance = Math.max(0, total - adv);

    let status = 'Unpaid';
    if (adv >= total) status = 'Paid';
    else if (adv > 0) status = 'Partial Paid';

    setInvoice(prev => ({
      ...prev,
      items,
      subtotal,
      cgstAmount: cgstAmt,
      sgstAmount: sgstAmt,
      igstAmount: igstAmt,
      total,
      advancePaid: adv,
      balanceDue: balance,
      status
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!invoice.customerName || !invoice.customerPhone) {
      alert('Please enter Customer Name and Phone Number.');
      return;
    }
    onSave(invoice);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello ${invoice.customerName},\nHere is your Tax Invoice summary from *KANHA DOOR HOUSE* (GSTIN: ${BUSINESS_INFO.gstin}).\n\n*Invoice No:* ${invoice.id}\n*Total Amount:* ₹${invoice.total.toLocaleString('en-IN')}\n*Advance Received:* ₹${invoice.advancePaid.toLocaleString('en-IN')}\n*Balance Payable:* ₹${invoice.balanceDue.toLocaleString('en-IN')}\n\nFor inquiries contact: ${BUSINESS_INFO.phone}`
    );
    window.open(`https://wa.me/${invoice.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-400" />
            <div>
              <h3 className="font-bold text-lg leading-none">{initialInvoice ? 'Edit Tax Invoice' : 'Generate New GST Tax Invoice'}</h3>
              <p className="text-xs text-slate-400 mt-1">KANHA DOOR HOUSE • GSTIN: {BUSINESS_INFO.gstin}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Customer & Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={invoice.customerName}
                onChange={e => setInvoice({ ...invoice, customerName: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer Phone *</label>
              <input
                type="text"
                required
                value={invoice.customerPhone}
                onChange={e => setInvoice({ ...invoice, customerPhone: e.target.value })}
                placeholder="e.g. +91 98351 12345"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice ID</label>
              <input
                type="text"
                value={invoice.id}
                onChange={e => setInvoice({ ...invoice, id: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-slate-100 font-mono font-bold text-slate-700"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Installation / Delivery Address</label>
              <input
                type="text"
                value={invoice.customerAddress}
                onChange={e => setInvoice({ ...invoice, customerAddress: e.target.value })}
                placeholder="e.g. Station Road, Marwadi Mohalla, Jamalpur, Bihar"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoice.date}
                onChange={e => setInvoice({ ...invoice, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={invoice.paymentMode}
                onChange={e => setInvoice({ ...invoice, paymentMode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white"
              >
                <option value="UPI / Online">UPI / Online Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Bank Cheque">Bank Cheque</option>
                <option value="NEFT / RTGS">NEFT / RTGS</option>
              </select>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-slate-800 text-sm">Line Items & Materials</h4>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Door/Window Item
              </button>
            </div>

            <div className="space-y-3">
              {invoice.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={e => updateItem(idx, 'description', e.target.value)}
                      placeholder="Product Description (e.g. UPVC Window 6x4 ft)"
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <select
                      value={item.hsn || '3925'}
                      onChange={e => updateItem(idx, 'hsn', e.target.value)}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs bg-white"
                    >
                      <option value="3925">HSN 3925 (UPVC/WPVC)</option>
                      <option value="7610">HSN 7610 (Aluminium)</option>
                      <option value="4418">HSN 4418 (Flush Doors)</option>
                      <option value="9954">SAC 9954 (Fitting Service)</option>
                    </select>
                  </div>
                  <div className="col-span-3 sm:col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={e => updateItem(idx, 'qty', e.target.value)}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs text-center"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={e => updateItem(idx, 'unitPrice', e.target.value)}
                      placeholder="Unit Price ₹"
                      className="w-full px-2 py-1.5 border rounded-lg text-xs text-right"
                    />
                  </div>
                  <div className="col-span-1 text-right font-bold text-slate-800">
                    ₹{item.amount.toLocaleString('en-IN')}
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Calculation & Advance Payment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-white p-5 rounded-xl">
            <div className="space-y-3 text-xs">
              <div className="font-bold text-emerald-400 text-sm">GST Tax Breakdown (Intra-State Bihar)</div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400">CGST Rate (%)</label>
                  <input
                    type="number"
                    value={invoice.cgstRate}
                    onChange={e => {
                      const r = parseFloat(e.target.value) || 0;
                      setInvoice(prev => ({ ...prev, cgstRate: r }));
                      recalculateTotals(invoice.items, r, invoice.sgstRate, invoice.igstRate, invoice.advancePaid);
                    }}
                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400">SGST Rate (%)</label>
                  <input
                    type="number"
                    value={invoice.sgstRate}
                    onChange={e => {
                      const r = parseFloat(e.target.value) || 0;
                      setInvoice(prev => ({ ...prev, sgstRate: r }));
                      recalculateTotals(invoice.items, invoice.cgstRate, r, invoice.igstRate, invoice.advancePaid);
                    }}
                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Advance Received (₹)</label>
                <input
                  type="number"
                  value={invoice.advancePaid}
                  onChange={e => {
                    const adv = parseFloat(e.target.value) || 0;
                    setInvoice(prev => ({ ...prev, advancePaid: adv }));
                    recalculateTotals(invoice.items, invoice.cgstRate, invoice.sgstRate, invoice.igstRate, adv);
                  }}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-emerald-400 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2 text-right justify-self-end w-full max-w-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{invoice.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CGST ({invoice.cgstRate}%):</span>
                <span>+ ₹{invoice.cgstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SGST ({invoice.sgstRate}%):</span>
                <span>+ ₹{invoice.sgstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-700 pt-2 text-white">
                <span>Grand Total:</span>
                <span className="text-emerald-400">₹{invoice.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Advance Paid:</span>
                <span className="text-emerald-400 font-bold">- ₹{invoice.advancePaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-red-400 text-sm border-t border-slate-800 pt-1">
                <span>Balance Payable:</span>
                <span>₹{invoice.balanceDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between items-center pt-4 border-t border-slate-200 gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => printGSTInvoice(invoice)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300"
              >
                <Printer className="w-4 h-4 text-emerald-700" /> Print / Save PDF Invoice
              </button>
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                <Share2 className="w-4 h-4" /> Share on WhatsApp
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-md"
              >
                <Save className="w-4 h-4 text-emerald-400" /> Save Tax Invoice
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
