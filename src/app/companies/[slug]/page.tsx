import clientPromise from "@/lib/mongodb";

interface Company {
  _id: string;
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
  jobPositions: string[];
  slug: string;
}

interface CompanyPageProps {
  params: { slug: string };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const client = await clientPromise;
  const db = client.db();
  const company = await db
    .collection<Company>("companies")
    .findOne({ slug: params.slug });

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div>
      <h1>{company.name}</h1>
      <p>Mission: {company.mission}</p>
      <p>Vision: {company.vision}</p>

      <h3>Why Work Here:</h3>
      <p>{company.whyWorkHere}</p>

      <h4>Contact Details:</h4>
      <p>Phone: {company.contactDetails.phone}</p>
      <p>Email: {company.contactDetails.email}</p>
      <p>Address: {company.contactDetails.address}</p>
    </div>
  );
}
