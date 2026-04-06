import { Transaction } from "@/types";

function d(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().split("T")[0];
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "1", date: d(0), amount: 4200, category: "Salary", type: "income", description: "Monthly salary", merchant: "Acme Corp" },
  { id: "2", date: d(1), amount: 89.5, category: "Food & Dining", type: "expense", description: "Grocery shopping", merchant: "Whole Foods" },
  { id: "3", date: d(2), amount: 12.99, category: "Entertainment", type: "expense", description: "Netflix subscription", merchant: "Netflix" },
  { id: "4", date: d(2), amount: 45, category: "Transport", type: "expense", description: "Uber rides", merchant: "Uber" },
  { id: "5", date: d(3), amount: 320, category: "Shopping", type: "expense", description: "New headphones", merchant: "Amazon" },
  { id: "6", date: d(4), amount: 850, category: "Freelance", type: "income", description: "Design project", merchant: "Client A" },
  { id: "7", date: d(5), amount: 65, category: "Food & Dining", type: "expense", description: "Restaurant dinner", merchant: "The Grill House" },
  { id: "8", date: d(6), amount: 120, category: "Utilities", type: "expense", description: "Electricity bill", merchant: "City Power" },
  { id: "9", date: d(7), amount: 1200, category: "Rent", type: "expense", description: "Monthly rent", merchant: "Landlord" },
  { id: "10", date: d(8), amount: 35, category: "Healthcare", type: "expense", description: "Pharmacy", merchant: "CVS" },
  { id: "11", date: d(9), amount: 200, category: "Investment", type: "income", description: "Dividend payment", merchant: "Fidelity" },
  { id: "12", date: d(10), amount: 55, category: "Food & Dining", type: "expense", description: "Coffee & snacks", merchant: "Starbucks" },
  { id: "13", date: d(11), amount: 180, category: "Shopping", type: "expense", description: "Clothing", merchant: "Zara" },
  { id: "14", date: d(12), amount: 30, category: "Transport", type: "expense", description: "Metro pass", merchant: "Transit Authority" },
  { id: "15", date: d(13), amount: 500, category: "Freelance", type: "income", description: "Consulting fee", merchant: "Client B" },
  { id: "16", date: d(14), amount: 75, category: "Entertainment", type: "expense", description: "Concert tickets", merchant: "Ticketmaster" },
  { id: "17", date: d(15), amount: 95, category: "Food & Dining", type: "expense", description: "Weekly groceries", merchant: "Trader Joe's" },
  { id: "18", date: d(16), amount: 49.99, category: "Education", type: "expense", description: "Online course", merchant: "Udemy" },
  { id: "19", date: d(18), amount: 150, category: "Healthcare", type: "expense", description: "Doctor visit", merchant: "City Clinic" },
  { id: "20", date: d(20), amount: 4200, category: "Salary", type: "income", description: "Monthly salary", merchant: "Acme Corp" },
  { id: "21", date: d(21), amount: 430, category: "Travel", type: "expense", description: "Flight tickets", merchant: "Airlines Co" },
  { id: "22", date: d(22), amount: 68, category: "Food & Dining", type: "expense", description: "Team lunch", merchant: "Chipotle" },
  { id: "23", date: d(23), amount: 25, category: "Transport", type: "expense", description: "Gas", merchant: "Shell" },
  { id: "24", date: d(24), amount: 300, category: "Gifts", type: "expense", description: "Birthday present", merchant: "Various" },
  { id: "25", date: d(25), amount: 80, category: "Utilities", type: "expense", description: "Internet bill", merchant: "ISP Co" },
  { id: "26", date: d(26), amount: 750, category: "Investment", type: "income", description: "Stock dividends", merchant: "Robinhood" },
  { id: "27", date: d(28), amount: 42, category: "Food & Dining", type: "expense", description: "Takeout", merchant: "DoorDash" },
  { id: "28", date: d(30), amount: 4200, category: "Salary", type: "income", description: "Monthly salary", merchant: "Acme Corp" },
  { id: "29", date: d(32), amount: 210, category: "Shopping", type: "expense", description: "Home supplies", merchant: "IKEA" },
  { id: "30", date: d(35), amount: 600, category: "Freelance", type: "income", description: "Logo design", merchant: "Client C" },
  { id: "31", date: d(38), amount: 1200, category: "Rent", type: "expense", description: "Monthly rent", merchant: "Landlord" },
  { id: "32", date: d(40), amount: 55, category: "Entertainment", type: "expense", description: "Spotify + Apple TV", merchant: "Various" },
  { id: "33", date: d(42), amount: 88, category: "Food & Dining", type: "expense", description: "Groceries", merchant: "Whole Foods" },
  { id: "34", date: d(45), amount: 120, category: "Transport", type: "expense", description: "Car service", merchant: "AutoShop" },
  { id: "35", date: d(50), amount: 4200, category: "Salary", type: "income", description: "Monthly salary", merchant: "Acme Corp" },
];

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#f97316",
  Shopping: "#8b5cf6",
  Transport: "#0ea5e9",
  Entertainment: "#ec4899",
  Healthcare: "#10b981",
  Utilities: "#64748b",
  Rent: "#ef4444",
  Salary: "#22c55e",
  Freelance: "#06b6d4",
  Investment: "#eab308",
  Education: "#6366f1",
  Travel: "#f59e0b",
  Gifts: "#d946ef",
  Other: "#94a3b8",
};

export const CATEGORY_ICONS: Record<string, string> = {
  "Food & Dining": "🍔",
  Shopping: "🛍️",
  Transport: "🚗",
  Entertainment: "🎬",
  Healthcare: "💊",
  Utilities: "⚡",
  Rent: "🏠",
  Salary: "💼",
  Freelance: "💻",
  Investment: "📈",
  Education: "📚",
  Travel: "✈️",
  Gifts: "🎁",
  Other: "📌",
};
