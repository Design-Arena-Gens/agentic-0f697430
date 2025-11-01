"use client";

import React, { useMemo, useState } from "react";
import { useExpenseStore } from "@store/useExpenseStore";
import { formatCurrency, formatDisplayDate } from "@lib/format";
import type { Expense, ExpenseCategory } from "@types/expense";

function EditableRow({ expense, onSave, onCancel }: { expense: Expense; onSave: (updates: Partial<Expense>) => void; onCancel: () => void; }) {
  const [description, setDescription] = useState(expense.description);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState<ExpenseCategory>(expense.category);
  const [dateISO, setDateISO] = useState(expense.dateISO);

  return (
    <tr>
      <td><input className="input" style={{ padding: 6 }} type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} /></td>
      <td><input className="input" style={{ padding: 6 }} value={description} onChange={(e) => setDescription(e.target.value)} /></td>
      <td style={{ width: 120 }}><input className="input" style={{ padding: 6 }} type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></td>
      <td>
        <select className="select" style={{ padding: 6 }} value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
          {useExpenseStore.getState().categories().map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </td>
      <td style={{ textAlign: "right", width: 160 }}>
        <div className="toolbar" style={{ justifyContent: "flex-end" }}>
          <button className="btn secondary" onClick={onCancel}>Cancel</button>
          <button className="btn" onClick={() => onSave({ description, amount: Number(amount), category, dateISO })} disabled={!description.trim() || !amount || Number(amount) <= 0}>Save</button>
        </div>
      </td>
    </tr>
  );
}

export default function ExpenseTable() {
  const expenses = useExpenseStore((s) => s.filteredExpenses());
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);
  const updateExpense = useExpenseStore((s) => s.updateExpense);

  const total = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="card">
      <div className="toolbar" style={{ justifyContent: "space-between" }}>
        <h3 style={{ marginBottom: 0 }}>Expenses</h3>
        <span className="badge">{expenses.length} items ? {formatCurrency(total)}</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: 140 }}>Date</th>
              <th>Description</th>
              <th style={{ width: 120 }}>Amount</th>
              <th style={{ width: 160 }}>Category</th>
              <th style={{ textAlign: "right", width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              editingId === e.id ? (
                <EditableRow key={e.id} expense={e} onCancel={() => setEditingId(null)} onSave={(upd) => { updateExpense(e.id, upd); setEditingId(null); }} />
              ) : (
                <tr key={e.id}>
                  <td>{formatDisplayDate(e.dateISO)}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{e.description}</div>
                    {e.notes ? <div style={{ color: "#64748b", fontSize: 12 }}>{e.notes}</div> : null}
                  </td>
                  <td>{formatCurrency(e.amount)}</td>
                  <td>{e.category}</td>
                  <td style={{ textAlign: "right" }}>
                    <div className="toolbar" style={{ justifyContent: "flex-end" }}>
                      <button className="btn secondary" onClick={() => setEditingId(e.id)}>Edit</button>
                      <button className="btn danger" onClick={() => deleteExpense(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No expenses yet. Add your first expense above.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
