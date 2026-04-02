import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../lib/format'
import type { CategoryBreakdownPoint } from '../types/finance'

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownPoint[]
}

const palette = ['#2f66b5', '#4a8f6f', '#d18f2f', '#6d5cae', '#2b7d9d', '#bb4f5b']

export const CategoryBreakdownChart = ({ data }: CategoryBreakdownChartProps) => {
  if (data.length === 0) {
    return (
      <div className="empty-chart">
        <p>No expense categories to show yet.</p>
      </div>
    )
  }

  return (
    <div className="category-chart-shell">
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={palette[index % palette.length]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="legend-list" aria-label="Category legend">
        {data.map((entry, index) => (
          <li key={entry.name}>
            <span
              className="legend-dot"
              style={{ backgroundColor: palette[index % palette.length] }}
              aria-hidden
            />
            <span>{entry.name}</span>
            <span>{entry.share.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
