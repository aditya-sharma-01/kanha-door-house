import { BUSINESS_INFO } from './types';

export const printGSTInvoice = (invoice) => {
  if (typeof window === 'undefined') return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print/download invoice.');
    return;
  }

  const itemsRows = invoice.items.map((item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1;">${item.description}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${item.hsn || '3925'}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${item.qty}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
      <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">₹${item.amount.toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>GST Tax Invoice - ${invoice.id} - Kanha Door House</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 25px; color: #0f172a; font-size: 14px; background: #fff; }
        .invoice-box { max-width: 850px; margin: auto; border: 2px solid #0f172a; padding: 25px; border-radius: 8px; }
        .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px solid #0f172a; padding-bottom: 15px; }
        .company-title { font-size: 26px; font-weight: 800; color: #047857; text-transform: uppercase; margin: 0; }
        .company-sub { font-size: 13px; color: #475569; margin-top: 4px; font-weight: 600; }
        .badge { background: #047857; color: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .info-col { width: 48%; }
        .info-title { font-weight: 700; color: #047857; font-size: 12px; text-transform: uppercase; margin-bottom: 6px; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; }
        table.items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table.items-table th { background: #0f172a; color: white; padding: 9px; text-align: left; font-size: 12px; border: 1px solid #0f172a; }
        .totals-table { width: 45%; float: right; border-collapse: collapse; margin-bottom: 30px; }
        .totals-table td { padding: 6px 10px; border-bottom: 1px solid #e2e8f0; }
        .clear { clear: both; }
        .terms { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 10px; display: flex; justify-content: space-between; }
        .signature-box { text-align: right; margin-top: 50px; }
        .signature-line { border-top: 1px solid #0f172a; width: 200px; display: inline-block; margin-top: 40px; }
        @media print {
          body { padding: 0; }
          .invoice-box { border: none; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align: center; margin-bottom: 20px;">
        <button onclick="window.print()" style="background: #047857; color: white; border: none; padding: 10px 24px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 15px;">🖨️ Print / Save PDF Invoice</button>
      </div>

      <div class="invoice-box">
        <table class="header-table">
          <tr>
            <td>
              <div class="company-title">${BUSINESS_INFO.name}</div>
              <div class="company-sub">${BUSINESS_INFO.tagline}</div>
              <div style="font-size: 12px; color: #334155; margin-top: 6px;">
                <strong>Address:</strong> ${BUSINESS_INFO.address}<br/>
                <strong>Phone:</strong> ${BUSINESS_INFO.phone} | <strong>Proprietor:</strong> ${BUSINESS_INFO.owner}
              </div>
            </td>
            <td style="text-align: right; vertical-align: top;">
              <div style="font-size: 20px; font-weight: 800; color: #0f172a;">TAX INVOICE</div>
              <div style="font-weight: bold; color: #047857; margin-top: 4px;">GSTIN: ${BUSINESS_INFO.gstin}</div>
              <div style="font-size: 12px; margin-top: 4px;">State Code: 10 (Bihar)</div>
            </td>
          </tr>
        </table>

        <div class="info-grid">
          <div class="info-col">
            <div class="info-title">Billed To (Customer Details)</div>
            <div><strong>Name:</strong> ${invoice.customerName}</div>
            <div><strong>Phone:</strong> ${invoice.customerPhone}</div>
            <div><strong>Installation Site:</strong> ${invoice.customerAddress}</div>
          </div>
          <div class="info-col">
            <div class="info-title">Invoice & Payment Info</div>
            <div><strong>Invoice No:</strong> <span style="font-family: monospace; font-weight: bold;">${invoice.id}</span></div>
            <div><strong>Date:</strong> ${invoice.date} | <strong>Due Date:</strong> ${invoice.dueDate || 'On Receipt'}</div>
            <div><strong>Status:</strong> <span class="badge" style="background: ${invoice.status === 'Paid' ? '#059669' : '#d97706'}">${invoice.status}</span></div>
            <div><strong>Payment Mode:</strong> ${invoice.paymentMode || 'N/A'}</div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 5%; text-align: center;">#</th>
              <th style="width: 45%;">Item Description & Material Specs</th>
              <th style="width: 12%; text-align: center;">HSN Code</th>
              <th style="width: 8%; text-align: center;">Qty</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 15%; text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td><strong>Subtotal Taxable Amount:</strong></td>
            <td style="text-align: right; font-weight: 600;">₹${invoice.subtotal.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td>CGST (${invoice.cgstRate || 9}%):</td>
            <td style="text-align: right;">₹${(invoice.cgstAmount || 0).toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td>SGST (${invoice.sgstRate || 9}%):</td>
            <td style="text-align: right;">₹${(invoice.sgstAmount || 0).toLocaleString('en-IN')}</td>
          </tr>
          ${invoice.igstAmount > 0 ? `
          <tr>
            <td>IGST (${invoice.igstRate || 18}%):</td>
            <td style="text-align: right;">₹${(invoice.igstAmount || 0).toLocaleString('en-IN')}</td>
          </tr>` : ''}
          <tr style="background: #f1f5f9; font-size: 15px; font-weight: 800;">
            <td style="color: #0f172a;">Grand Total:</td>
            <td style="text-align: right; color: #047857;">₹${invoice.total.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td>Advance / Received:</td>
            <td style="text-align: right; color: #059669; font-weight: bold;">- ₹${(invoice.advancePaid || 0).toLocaleString('en-IN')}</td>
          </tr>
          <tr style="font-weight: 700; color: #b91c1c; background: #fef2f2;">
            <td>Balance Payable:</td>
            <td style="text-align: right;">₹${(invoice.balanceDue !== undefined ? invoice.balanceDue : (invoice.total - (invoice.advancePaid || 0))).toLocaleString('en-IN')}</td>
          </tr>
        </table>
        
        <div class="clear"></div>

        <div style="background: #f8fafc; padding: 10px; border-radius: 4px; border-left: 3px solid #047857; margin-bottom: 20px; font-size: 12px;">
          <strong>Notes / Customization:</strong> ${invoice.notes || 'Goods once sold are covered under Kanha Door House 5-Year Hardware & Moisture Guarantee.'}
        </div>

        <div class="terms">
          <div>
            <strong>Terms & Conditions:</strong><br/>
            1. All doors & windows manufactured with precision machinery.<br/>
            2. Installation site must be clear and accessible.<br/>
            3. Subject to Jamalpur/Munger jurisdiction.
          </div>
          <div class="signature-box">
            For <strong>KANHA DOOR HOUSE</strong><br/>
            <div class="signature-line"></div><br/>
            Authorized Signatory (Sonu Sharma)
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
