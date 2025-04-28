import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Import the connection setup
import { createCompany, listCompanies } from '@/lib/companies'; // Import your logic for creating and listing companies

// Create a company
export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Get request body
    const company = await createCompany(body); // Call function to create company
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Failed to create company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

// Get list of companies (or a specific company by slug)
export async function GET(req: NextRequest) {
	const { searchParams } = req.nextUrl;
	const slug = searchParams.get('slug'); // Get 'slug' from query params if it exists
  
	try {
	  if (slug) {
		const client = await clientPromise; // Connect to MongoDB
		const db = client.db(); // Access the database
		const company = await db.collection('companies').findOne({ slug }); // Query for company by slug
  
		if (!company) {
		  return NextResponse.json({ error: 'Company not found' }, { status: 404 });
		}
  
		return NextResponse.json(company);
	  }
  
	  const companies = await listCompanies();
	  return NextResponse.json(companies);
	} catch (error) {
	  console.error('Failed to fetch companies:', error);
	  return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
	}
  }