'use client'
import JobForm from '@/components/JobForm'
import { useEffect, useState } from "react";
import { Job, Company } from "@/components/types";

type Props = {
  onClose: () => void;
  
};
export default function AddJobFormWrapper({onClose}:Props) {
      const [companies, setCompanies] = useState<Company[]>([]); // Fetch companies here

      useEffect(() => {
        
        // Fetch companies
        async function fetchCompanies() {
          const res = await fetch("/api/companies");
          const data = await res.json();
          setCompanies(data);
        }
  
        fetchCompanies();
      }, []);
    
      const addJob = (newJob: Job) => {
       
      console.log(newJob)
      };

  return (
    <div>
      <JobForm addJob={addJob} onClose={onClose} companies={companies}/>
    </div>
  )
}
