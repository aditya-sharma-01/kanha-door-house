import { NextResponse } from 'next/server';
import { INITIAL_INVOICES } from '@/lib/types';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let invoices = INITIAL_INVOICES;
  if (status) {
    invoices = invoices.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }

  return NextResponse.json({
    success: true,
    count: invoices.length,
    invoices
  }, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.customerPhone) {
      return NextResponse.json({ success: false, message: 'Missing customerName or customerPhone' }, { status: 400 });
    }

    const newInvoice = {
      id: body.id || `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress || 'Jamalpur, Bihar',
      date: body.date || new Date().toISOString().split('T')[0],
      items: body.items || [],
      subtotal: body.subtotal || 0,
      total: body.total || 0,
      advancePaid: body.advancePaid || 0,
      balanceDue: body.balanceDue || 0,
      status: body.status || 'Pending'
    };

    return NextResponse.json({
      success: true,
      message: 'Invoice created successfully',
      invoice: newInvoice
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
