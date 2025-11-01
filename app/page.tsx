"use client";

import React from "react";
import ExpenseForm from "@components/ExpenseForm";
import Filters from "@components/Filters";
import SummaryCards from "@components/SummaryCards";
import Charts from "@components/Charts";
import ExpenseTable from "@components/ExpenseTable";
import { useExpenseStore } from "@store/useExpenseStore";

export default function Page() {
  const clearAll = useExpenseStore((s) => s.clearAll);

  return (
    <div className="container">
      <div className="header">
        <h1>Personal Expenses Dashboard</h1>
        <div className="toolbar">
          <button className="btn secondary" onClick={() => {
            const data = JSON.stringify(useExpenseStore.getState().expenses, null, 2);
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "expenses.json"; a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}>Export JSON</button>
          <label className="btn secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            Import JSON
            <input type="file" accept="application/json" style={{ display: "none" }} onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const text = await file.text();
                const json = JSON.parse(text);
                if (!Array.isArray(json)) throw new Error("Invalid file");
                const add = useExpenseStore.getState().addExpense;
                json.forEach((obj: any) => {
                  if (obj && obj.dateISO && obj.description && obj.amount && obj.category) {
                    add({ dateISO: String(obj.dateISO), description: String(obj.description), amount: Number(obj.amount), category: String(obj.category) as any, notes: obj.notes ? String(obj.notes) : undefined });
                  }
                });
              } catch (err) {
                alert("Failed to import file");
              }
              e.currentTarget.value = "";
            }} />
          </label>
          <button className="btn danger" onClick={() => { if (confirm("Delete all expenses?")) clearAll(); }}>Clear All</button>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 16 }}>
        <div className="col-8"><ExpenseForm /></div>
        <div className="col-4"><Filters /></div>
      </div>

      <SummaryCards />

      <div style={{ height: 16 }} />

      <Charts />

      <div style={{ height: 16 }} />

      <ExpenseTable />

      <footer>Data is stored locally in your browser. No server required.</footer>
    </div>
  );
}
