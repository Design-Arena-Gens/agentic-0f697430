"use client";

import React from "react";
import { useExpenseStore } from "@store/useExpenseStore";

export default function Filters() {
  const filters = useExpenseStore((s) => s.filters);
  const setFilters = useExpenseStore((s) => s.setFilters);
  const categories = useExpenseStore((s) => s.categories());
  const months = useExpenseStore((s) => s.months());

  return (
    <div className="card">
      <h3>Filters</h3>
      <div className="row" style={{ marginTop: 8 }}>
        <div className="col-6">
          <label className="label">Search</label>
          <input className="input" placeholder="Search description or notes" value={filters.query} onChange={(e) => setFilters({ query: e.target.value })} />
        </div>
        <div className="col-3">
          <label className="label">Category</label>
          <select className="select" value={filters.category} onChange={(e) => setFilters({ category: e.target.value as any })}>
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label className="label">Month</label>
          <select className="select" value={filters.month} onChange={(e) => setFilters({ month: e.target.value as any })}>
            <option value="All">All</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
