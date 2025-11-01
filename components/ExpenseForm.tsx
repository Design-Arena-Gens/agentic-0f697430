"use client";

import React from "react";
import { useState } from "react";
import { useExpenseStore } from "@store/useExpenseStore";
import type { ExpenseCategory } from "@types/expense";

export default function ExpenseForm() {
  const addExpense = useExpenseStore((s) => s.addExpense);
  const categories = useExpenseStore((s) => s.categories());

  const [dateISO, setDateISO] = useState<string>(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [notes, setNotes] = useState("");

  function canSubmit(): boolean {
    const amt = Number(amount);
    return !!dateISO && description.trim().length > 0 && !Number.isNaN(amt) && amt > 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit()) return;
    addExpense({ dateISO, description: description.trim(), amount: Number(amount), category, notes: notes.trim() || undefined });
    setDescription("");
    setAmount("");
    setNotes("");
  }

  return (
    <form className="card" onSubmit={onSubmit}>
      <h3>Add Expense</h3>
      <div className="row" style={{ marginTop: 8 }}>
        <div className="col-4">
          <label className="label">Date</label>
          <input className="input" type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
        </div>
        <div className="col-4">
          <label className="label">Description</label>
          <input className="input" placeholder="e.g. Groceries" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="col-4">
          <label className="label">Amount</label>
          <input className="input" type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="col-6">
          <label className="label">Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-6">
          <label className="label">Notes (optional)</label>
          <input className="input" placeholder="Details" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="col-12" style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <button className="btn" type="submit" disabled={!canSubmit()}>Add</button>
        </div>
      </div>
    </form>
  );
}
