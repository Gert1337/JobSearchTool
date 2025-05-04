import { useState } from "react";
import { Company } from "./types";
import { useRouter } from "next/navigation";

interface CompanyFormProps {

  onClose: ()=> void; 
}

export const CompanyForm = ({ onClose }: CompanyFormProps) => {
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
  const router = useRouter();

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
    console.log("submittet:",data)
    onClose()
    router.push("/")
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-white p-6 rounded-md max-w-2xl"
    >
      <div className="flex flex-col">
        <label htmlFor={formData.name} className="text-sm font-medium mb-2">
          Company Name
        </label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        name="mission"
        value={formData.mission}
        onChange={handleChange}
        placeholder="Mission"
        className="border p-2 rounded"
      />
      <textarea
        name="vision"
        value={formData.vision}
        onChange={handleChange}
        placeholder="Vision"
        className="border p-2 rounded"
      />
      <input
        name="values"
        value={formData.values.join(", ")}
        onChange={handleChange}
        placeholder="Values (comma separated)"
        className="border p-2 rounded"
      />
      <input
        name="contactDetails.phone"
        value={formData.contactDetails.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="border p-2 rounded"
      />
      <input
        name="contactDetails.email"
        value={formData.contactDetails.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 rounded"
      />
      <input
        name="contactDetails.address"
        value={formData.contactDetails.address}
        onChange={handleChange}
        placeholder="Address"
        className="border p-2 rounded"
      />
      <textarea
        name="whyWorkHere"
        value={formData.whyWorkHere}
        onChange={handleChange}
        placeholder="Why Work Here?"
        className="border p-2 rounded"
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
        className="border p-2 rounded"
      />
      <input
        name="jobPositions"
        value={formData.jobPositions.join(", ")}
        onChange={handleChange}
        placeholder="Related Job IDs (comma separated)"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Add Company
      </button>
    </form>
  );
};
export default CompanyForm;
