import { NextRequest, NextResponse } from 'next/server';
import { createCompany, listCompanies } from '@/lib/companies';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const company = await createCompany(body);
		return NextResponse.json(company, { status: 201 });
	} catch (error) {
		console.error('Failed to create company:', error);
		return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
	}
}

export async function GET() {
	try {
		const companies = await listCompanies();
		return NextResponse.json(companies);
	} catch (error) {
		console.error('Failed to fetch companies:', error);
		return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
	}
}