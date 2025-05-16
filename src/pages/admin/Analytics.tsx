import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
// import your charting library here, e.g. import { AreaChart, BarChart, PieChart, LineChart } from 'recharts';

const DATE_RANGES = [
  { label: "Last 7 days", value: "7d" },
  { label: "This Month", value: "month" },
  { label: "Custom", value: "custom" },
];

const quizData = [
  { name: 'Easy', value: 400 },
  { name: 'Medium', value: 300 },
  { name: 'Hard', value: 100 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Analytics() {
  const [dateRange, setDateRange] = useState("month");

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-gray-500">&larr; Dashboard</Button>
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map(r => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">Export ▾</Button>
        </div>
      </div>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Total Users", value: "1,200" },
          { label: "Active Modules", value: "85" },
          { label: "Avg. Session", value: "38m" },
          { label: "Quiz Completion", value: "72%" },
          { label: "Projects Completed", value: "320" },
          { label: "Drive Registrations", value: "210" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            {/* Icon or sparkline can go here */}
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="text-xs text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Engagement Trends */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="font-semibold mb-2">Engagement Trends</h2>
        {/* Replace with your dual-axis area chart */}
        <div className="h-64 flex items-center justify-center text-gray-400">[Area Chart: Daily Active Users & New Sign-ups]</div>
      </div>

      {/* Row 2: Content Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Top 5 Modules by Completion</h2>
          {/* Replace with horizontal bar chart */}
          <div className="h-48 flex items-center justify-center text-gray-400">[Bar Chart]</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Quiz Difficulty Breakdown</h2>
          {/* Replace with pie chart */}
          <div className="h-48 flex items-center justify-center text-gray-400">
            <PieChart width={200} height={200}>
              <Pie data={quizData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {quizData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Row 3: Feature Usage & Placement Prep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Code Submissions Over Time</h2>
          {/* Replace with line chart */}
          <div className="h-48 flex items-center justify-center text-gray-400">[Line Chart]</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold mb-2">Placement Drive Registrations by Company</h2>
          {/* Replace with bar chart */}
          <div className="h-48 flex items-center justify-center text-gray-400">[Bar Chart]</div>
        </div>
      </div>

      {/* Row 4: Data Table — Detailed Metrics */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 overflow-x-auto">
        <h2 className="font-semibold mb-2">Detailed Module Metrics</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-semibold">Module Name</th>
              <th className="p-2 text-left font-semibold">Avg. Time Spent</th>
              <th className="p-2 text-left font-semibold">Completion Rate</th>
              <th className="p-2 text-left font-semibold">Drop-off Point</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Arrays 101", time: "12m", rate: "83%", drop: "Lesson 3" },
              { name: "Two Sum", time: "20m", rate: "76%", drop: "Lesson 2" },
              // ...more
            ].map(row => (
              <tr key={row.name} className="border-t hover:bg-gray-50">
                <td className="p-2">{row.name}</td>
                <td className="p-2">{row.time}</td>
                <td className="p-2">{row.rate}</td>
                <td className="p-2">{row.drop}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end mt-2">
          <Button variant="outline">Export Table</Button>
        </div>
      </div>
    </div>
  );
}
