"use client";
import { useEffect, useState } from "react";

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
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // Fetch the companies data from the API
    async function fetchCompanies() {
      const response = await fetch("/api/companies");
      const data = await response.json();
      setCompanies(data);
    }

    fetchCompanies();
  }, []);

  return (
    <div>
      <h1>Companies</h1>
      <ul>
        {companies.map((company) => (
          <li key={company._id} className="p-4">
            <h2>Name:{company.name}</h2>
            <p>Mission:{company.mission}</p>
            <p>Vison:{company.vision}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
