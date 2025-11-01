"use client";

import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { useExpenseStore } from "@store/useExpenseStore";
import { formatCurrency } from "@lib/format";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Charts() {
  const totals = useExpenseStore((s) => s.totals());

  const categoryLabels = Object.keys(totals.byCategory);
  const categoryValues = Object.values(totals.byCategory);

  const monthLabels = Object.keys(totals.byMonth).sort();
  const monthValues = monthLabels.map((m) => totals.byMonth[m]);

  const colors = [
    "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6",
    "#f97316", "#84cc16", "#06b6d4", "#a3e635", "#e11d48", "#475569"
  ];

  return (
    <div className="row">
      <div className="col-6">
        <div className="card">
          <h3>By Category</h3>
          {categoryLabels.length ? (
            <Pie data={{
              labels: categoryLabels,
              datasets: [{ data: categoryValues, backgroundColor: colors.slice(0, categoryLabels.length) }]
            }} />
          ) : (
            <div>No data yet</div>
          )}
        </div>
      </div>
      <div className="col-6">
        <div className="card">
          <h3>By Month</h3>
          {monthLabels.length ? (
            <Bar options={{
              scales: { y: { ticks: { callback: (v) => formatCurrency(Number(v)) } } },
              plugins: { legend: { display: false } }
            }} data={{
              labels: monthLabels,
              datasets: [{ label: "Total", data: monthValues, backgroundColor: "#0ea5e9" }]
            }} />
          ) : (
            <div>No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
