export const reportMode = {
  data: [
    {
      _id: "1",
      name: "Sales",
    },
    {
      _id: "2",
      name: "Marketing",
    },
    {
      _id: "3",
      name: "Bank",
    },
  ],
};

type ReportModeId = "1" | "2" | "3";

export const reportOptions: Record<ReportModeId, string[]> = {
  "1": [
    "Retail & Shopping",
    "Real Estate & Property",
    "Business-to-Business",
    "Service Sales",
  ],
  "2": [
    "Retail / Shopping Marketing",
    "Real Estate / Land Marketing",
    "Digital & Online Marketing",
    "Strategic & Traditional Marketing",
  ],
  "3": [
    "Customer & Loan Reports",
    "Internal Management & Risk Reports",
    "Regulatory & Statutory Reports",
  ],
};

export const companies: Record<ReportModeId, string[]> = {
  "1": ["Sale Force", "Amazon India", "Tata Motors", "Asian Paints"],
  "2": ["Cognizant"],
  "3": ["State Bank of India"],
};