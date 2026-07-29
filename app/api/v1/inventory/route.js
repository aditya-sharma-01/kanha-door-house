import { NextResponse } from 'next/server';
import { INITIAL_INVENTORY } from '@/lib/types';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lowStockOnly = searchParams.get('lowStock') === 'true';

  let items = INITIAL_INVENTORY;
  if (lowStockOnly) {
    items = items.filter(i => i.stock <= i.minAlert);
  }

  return NextResponse.json({
    success: true,
    count: items.length,
    inventory: items
  }, { status: 200 });
}
