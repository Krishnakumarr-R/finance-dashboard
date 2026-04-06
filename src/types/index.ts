export type TransactionCategory =
  | "Food & Dining"
  | "Shopping"
  | "Transport"
  | "Entertainment"
  | "Healthcare"
  | "Utilities"
  | "Rent"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Education"
  | "Travel"
  | "Gifts"
  | "Other";

export type TransactionType = "income" | "expense";
export type Role = "admin" | "viewer";
export type TimeRange = "7d" | "30d" | "90d" | "1y";
export type SortField = "date" | "amount" | "category" | "type";
export type SortDir = "asc" | "desc";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  description: string;
  merchant?: string;
}

export interface FilterState {
  search: string;
  category: TransactionCategory | "All";
  type: TransactionType | "All";
  dateFrom: string;
  dateTo: string;
  sortField: SortField;
  sortDir: SortDir;
  minAmount: string;
  maxAmount: string;
}

export interface AppState {
  role: Role;
  darkMode: boolean;
  transactions: Transaction[];
  filters: FilterState;
  timeRange: TimeRange;
  setRole: (role: Role) => void;
  toggleDarkMode: () => void;
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  setTimeRange: (range: TimeRange) => void;
}
