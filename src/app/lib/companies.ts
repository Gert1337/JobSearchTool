import { ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { Company } from '@/components/types';


type CompanyWithStringId = Omit<Company, '_id'> & { _id: string };

function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '') // Remove all non-word characters
      .replace(/\-\-+/g, '-'); // Replace multiple dashes with a single dash
  }

// Create a new company
export async function createCompany(company: Omit<Company, '_id'>): Promise<Company> {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection<Company>('companies');
    
    const slug = generateSlug(company.name); // Generate slug from company name
    const result = await collection.insertOne({ ...company, slug }); // Save the company with the slug
  
    const createdCompany = await collection.findOne({ _id: result.insertedId });
  
    if (!createdCompany) {
      throw new Error('Failed to create company');
    }
  
    return createdCompany;
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

export async function getCompanyById(id: string): Promise<CompanyWithStringId | null> {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection<Company>('companies');

  const company = await collection.findOne({ _id: new ObjectId(id) })

  if (!company) return null;

  return {
    ...company,
    _id: company._id.toString(), // Convert ObjectId to string
  };

}