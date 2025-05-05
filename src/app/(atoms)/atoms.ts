import { Company, Job} from "@/components/types";
import { atom } from "jotai";

// Atom to control if the "Add Job" modal is open
export const showNewJobModalAtom = atom(false);

// Atom to control if the "Add Company" modal is open
export const showNewCompanyModalAtom = atom(false);

// Atom for the list of jobs
export const jobsAtom = atom<Job[]>([]);

// Atom for the list of companies
export const companiesAtom = atom<Company[]>([]);

