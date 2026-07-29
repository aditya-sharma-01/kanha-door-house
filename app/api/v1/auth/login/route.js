import { NextResponse } from 'next/server';
import { INITIAL_STAFF } from '@/lib/types';

export async function POST(request) {
  try {
    const { username, passcode } = await request.json();
    
    // Quick demonstration passcode verification for mobile app endpoints
    if (passcode === '123456' || passcode === 'admin123' || passcode === 'tech123') {
      const role = passcode === 'tech123' ? 'Field Technician' : 'Admin';
      return NextResponse.json({
        success: true,
        user: {
          id: 'USR-99',
          name: username || 'Sonu Sharma',
          role: role,
          business: 'Kanha Door House',
          gstin: '10EOTP5377R1ZR'
        },
        token: 'kdh_api_jwt_token_sample_2026'
      }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
