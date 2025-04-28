import { useState } from "react";

interface CompanyFormProps {
  addCompany: (company: Company) => void;
}

interface Company {
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

export const CompanyForm = ({ addCompany }: CompanyFormProps) => {
  const [formData, setFormData] = useState<Company>({
    name: "",
    mission: "",
    vision: "",
    values: [],
    contactDetails: {
      phone: "",
      email: "",
      address: "",
    },
    whyWorkHere: "",
    rating: 0,
    jobPositions: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.startsWith("contactDetails.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contactDetails: {
          ...prev.contactDetails,
          [field]: value,
        },
      }));
    } else if (name === "values" || name === "jobPositions") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.split(",").map((item) => item.trim()),
      }));
    } else if (name === "rating") {
      setFormData((prev) => ({
        ...prev,
        rating: parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    addCompany(data);
    // Reset form
    setFormData({
      name: "",
      mission: "",
      vision: "",
      values: [],
      contactDetails: {
        phone: "",
        email: "",
        address: "",
      },
      whyWorkHere: "",
      rating: 0,
      jobPositions: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Company Name"
        required
      />
      <textarea
        name="mission"
        value={formData.mission}
        onChange={handleChange}
        placeholder="Mission"
      />
      <textarea
        name="vision"
        value={formData.vision}
        onChange={handleChange}
        placeholder="Vision"
      />
      <input
        name="values"
        value={formData.values.join(", ")}
        onChange={handleChange}
        placeholder="Values (comma separated)"
      />
      <input
        name="contactDetails.phone"
        value={formData.contactDetails.phone}
        onChange={handleChange}
        placeholder="Phone"
      />
      <input
        name="contactDetails.email"
        value={formData.contactDetails.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="contactDetails.address"
        value={formData.contactDetails.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <textarea
        name="whyWorkHere"
        value={formData.whyWorkHere}
        onChange={handleChange}
        placeholder="Why Work Here?"
      />
      <input
        type="number"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        placeholder="Rating (0-5)"
        min={0}
        max={5}
        step="0.1"
      />
      <input
        name="jobPositions"
        value={formData.jobPositions.join(", ")}
        onChange={handleChange}
        placeholder="Related Job IDs (comma separated)"
      />
      <button type="submit">Add Company</button>
    </form>
  );
};
export default CompanyForm;
