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

type TrendSeriesKey = 'income' | 'expenses' | 'cumulative'

type TrendTooltipProps = {
  active?: boolean
  payload?: Array<{
    payload?: MonthlyTrendPoint
  }>
}

const trendSeries: Array<{
  key: TrendSeriesKey
  label: string
  color: string
  description: string
}> = [
  {
    key: 'income',
    label: 'Income',
    color: '#1f7a4d',
    description: 'Monthly income total',
  },
  {
    key: 'expenses',
    label: 'Expenses',
    color: '#b53a45',
    description: 'Monthly expense total',
  },
  {
    key: 'cumulative',
    label: 'Running balance',
    color: '#2f66b5',
    description: 'Cumulative net balance',
  },
]

const TrendTooltip = ({ active, payload }: TrendTooltipProps) => {
  if (!active || !payload?.length) {
    return null
  }

  const data = payload[0]?.payload as MonthlyTrendPoint | undefined

  if (!data) {
    return null
  }

  return (
    <div className="trend-tooltip">
      <p className="trend-tooltip-month">{data.monthLabel}</p>
      <div className="trend-tooltip-list">
        {trendSeries.map((series) => (
          <div key={series.key} className="trend-tooltip-row">
            <span className="trend-tooltip-name">
              <span
                className="trend-tooltip-swatch"
                style={{ backgroundColor: series.color }}
                aria-hidden
              />
              {series.label}
            </span>
            <span className="trend-tooltip-value">
              {formatCurrency(data[series.key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
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
    <div className="chart-wrap trend-chart">
      <div className="trend-chart-intro">
        <p className="trend-chart-note">
          Income and expenses are monthly totals. Blue shows the cumulative balance across the period.
        </p>

        <div className="trend-legend" aria-label="Balance trend legend">
          {trendSeries.map((series) => (
            <div key={series.key} className="trend-legend-item">
              <span
                className="trend-legend-swatch"
                style={{ backgroundColor: series.color }}
                aria-hidden
              />
              <span>
                <strong>{series.label}</strong>
                <small>{series.description}</small>
              </span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 6" stroke="rgba(42, 71, 104, 0.16)" />
          <XAxis
            dataKey="monthLabel"
            stroke="#4c667c"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            interval={0}
          />
          <YAxis
            width={64}
            stroke="#4c667c"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`}
          />
          <Tooltip
            content={<TrendTooltip />}
            cursor={{ stroke: 'rgba(47, 102, 181, 0.28)', strokeWidth: 1 }}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid rgba(48, 86, 124, 0.22)',
              boxShadow: '0 12px 20px rgba(22, 38, 60, 0.14)',
            }}
            labelStyle={{ color: '#4c667c', fontWeight: 600 }}
          />
          <Line
            type="linear"
            dataKey="income"
            stroke="#1f7a4d"
            strokeWidth={2.25}
            dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 6, strokeWidth: 2, fill: '#ffffff' }}
            name="Income"
          />
          <Line
            type="linear"
            dataKey="expenses"
            stroke="#b53a45"
            strokeWidth={2.25}
            strokeDasharray="6 4"
            dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 6, strokeWidth: 2, fill: '#ffffff' }}
            name="Expenses"
          />
          <Line
            type="linear"
            dataKey="cumulative"
            stroke="#2f66b5"
            strokeWidth={3.25}
            dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
            activeDot={{ r: 7, strokeWidth: 2, fill: '#ffffff' }}
            name="Running Balance"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
