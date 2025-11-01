"use client";

import React from "react";
import { useExpenseStore } from "@store/useExpenseStore";
import { formatCurrency } from "@lib/format";

export default function SummaryCards() {
  const totals = useExpenseStore((s) => s.totals());
  const filteredExpenses = useExpenseStore((s) => s.filteredExpenses());

  const count = filteredExpenses.length;
  const average = count ? totals.total / count : 0;
  const largest = filteredExpenses.reduce((max, e) => (e.amount > max ? e.amount : max), 0);

  return (
    <div className="row">
      <div className="col-4">
        <div className="card">
          <h3>Total Spent</h3>
          <div className="kpi"><span className="stat">{formatCurrency(totals.total)}</span><small>across {count} expenses</small></div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <h3>Average Expense</h3>
          <div className="kpi"><span className="stat">{formatCurrency(average)}</span><small>per item</small></div>
        </div>
      </div>
      <div className="col-4">
        <div className="card">
          <h3>Largest Expense</h3>
          <div className="kpi"><span className="stat">{formatCurrency(largest)}</span><small>max</small></div>
        </div>
      </div>
    </div>
  );
}
