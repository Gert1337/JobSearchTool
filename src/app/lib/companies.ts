import clientPromise from './mongodb';

export interface Company {
  name: string;
  mission: string;
  vision: string;
  values: string[];
  contactDetails: {
    phone: string;
    email: string;
    address: string;
  };
  whyWorkHere: string;
  rating: number;
  jobPositions: string[]; // Array of Job IDs related to this company
}

// Create a new company
export async function createCompany(company: Omit<Company, '_id'>): Promise<Company> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Company>('companies');

  const result = await collection.insertOne(company);

  const createdCompany = await collection.findOne({ _id: result.insertedId });

  if (!createdCompany) {
    throw new Error('Failed to create company');
  }

  return createdCompany; // Return the full company object, including _id
}

// List all companies
export async function listCompanies(): Promise<Company[]> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Company>('companies');

  const companies = await collection.find().toArray();

  const serializedCompanies = companies.map(company => ({
    ...company,
    _id: company._id.toString(), // Convert ObjectId to string
  }));

  return serializedCompanies;
}