export type ExpenseCategory =
  | "Housing"
  | "Transportation"
  | "Food"
  | "Utilities"
  | "Insurance"
  | "Healthcare"
  | "Savings"
  | "Entertainment"
  | "Personal"
  | "Education"
  | "Gifts"
  | "Other";

export interface Expense {
  id: string;
  dateISO: string; // yyyy-MM-dd
  description: string;
  amount: number; // positive decimal
  category: ExpenseCategory;
  notes?: string;
}

export interface ExpenseFilters {
  query: string;
  category: ExpenseCategory | "All";
  month: string | "All"; // yyyy-MM
}
