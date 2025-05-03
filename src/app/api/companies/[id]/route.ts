import { NextResponse } from 'next/server';
import { getCompanyById } from '@/lib/companies'; // Justér stien hvis nødvendigt

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const company = await getCompanyById(params.id);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Invalid ID or internal error' }, { status: 400 });
  }
}