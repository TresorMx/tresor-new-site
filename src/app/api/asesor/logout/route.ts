import { NextResponse } from 'next/server';
import { ASESOR_COOKIE, ASESOR_UI_COOKIE } from '@/lib/asesor/session';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ASESOR_COOKIE);
  res.cookies.delete(ASESOR_UI_COOKIE);
  return res;
}
