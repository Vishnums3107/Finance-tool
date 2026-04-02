import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../lib/format'
import type { MonthlyTrendPoint } from '../types/finance'

interface BalanceTrendChartProps {
  data: MonthlyTrendPoint[]
}

export const BalanceTrendChart = ({ data }: BalanceTrendChartProps) => {
  if (data.length === 0) {
    return (
      <div className="empty-chart">
        <p>No monthly trend available yet.</p>
      </div>
    )
  }

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 6" stroke="rgba(42, 71, 104, 0.16)" />
          <XAxis dataKey="monthLabel" stroke="#4c667c" tickLine={false} axisLine={false} />
          <YAxis
            stroke="#4c667c"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
          />
          <Tooltip
            formatter={(value) => {
              const numericValue = Array.isArray(value)
                ? Number(value[0])
                : Number(value ?? 0)

              return formatCurrency(numericValue)
            }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid rgba(48, 86, 124, 0.22)',
              boxShadow: '0 12px 20px rgba(22, 38, 60, 0.14)',
            }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#1f7a4d"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="#b53a45"
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2 }}
            activeDot={{ r: 5 }}
            name="Expenses"
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#2f66b5"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Running Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
