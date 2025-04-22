
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Line, LineChart } from "recharts";
import { Link } from "react-router-dom";

// Mocked data for performance
const timelinePerformance = [
  {
    id: "timeline-1",
    name: "Standard Collections",
    avgRecoveryDays: 15,
    totalRecovered: 130000,
    recoveredCustomers: 42,
  },
  {
    id: "timeline-2",
    name: "Aggressive Followup",
    avgRecoveryDays: 3,
    totalRecovered: 34000,
    recoveredCustomers: 15,
  },
  {
    id: "timeline-3",
    name: "Gentle Reminder",
    avgRecoveryDays: 22,
    totalRecovered: 49000,
    recoveredCustomers: 28,
  },
];

// Formatting helpers
const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 2 });
const formatDays = (value: number) => `${value} days`;
const formatCust = (value: number) => `${value} customers`;

const chartConfig = {
  Standard: { color: "#06b6d4", label: "Standard" },
  Aggressive: { color: "#22c55e", label: "Aggressive" },
  Gentle: { color: "#fbbf24", label: "Gentle" },
};

const barChartData = timelinePerformance.map((t, idx) => ({
  name: t.name,
  avgRecoveryDays: t.avgRecoveryDays,
  totalRecovered: t.totalRecovered,
  recoveredCustomers: t.recoveredCustomers,
}));

export default function CollectionTimelinePerformance() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Collections Timeline Performance</CardTitle>
        <p className="text-muted-foreground mt-1 text-base">
          Compare recovery speed, amounts, and customer performance across different collections timelines.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Performance Table</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Avg. Recovery Days</TableHead>
                  <TableHead>Total Recovered</TableHead>
                  <TableHead>Recovered Customers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timelinePerformance.map(tp => (
                  <TableRow key={tp.id}>
                    <TableCell>{tp.name}</TableCell>
                    <TableCell>{tp.avgRecoveryDays}</TableCell>
                    <TableCell>{formatCurrency(tp.totalRecovered)}</TableCell>
                    <TableCell>{tp.recoveredCustomers}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-2">Average Recovery Days</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={formatDays} />
                <Bar dataKey="avgRecoveryDays" fill="#06b6d4">
                  <LabelList dataKey="avgRecoveryDays" position="top" formatter={formatDays} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Recovered Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={formatCurrency} />
                  <Bar dataKey="totalRecovered" fill="#22c55e">
                    <LabelList dataKey="totalRecovered" position="top" formatter={formatCurrency} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recovered Customers (line chart)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={formatCust} />
                  <Line dataKey="recoveredCustomers" stroke="#fbbf24" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end mt-8">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/">Back to Timeline List</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
