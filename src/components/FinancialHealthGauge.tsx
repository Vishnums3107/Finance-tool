import { useEffect, useState } from 'react'
import type { HealthScoreResult } from '../lib/healthScore'

interface FinancialHealthGaugeProps {
  healthScore: HealthScoreResult
}

const GAUGE_RADIUS = 80
const STROKE_WIDTH = 14
const CIRCUMFERENCE = 2 * Math.PI * GAUGE_RADIUS
const ARC_LENGTH = CIRCUMFERENCE * 0.75 // 270° arc

function getGaugeColor(score: number): string {
  if (score >= 80) return '#34d399'   // emerald
  if (score >= 60) return '#60a5fa'   // blue
  if (score >= 40) return '#fbbf24'   // amber
  return '#f87171'                     // red
}

function getGradeEmoji(grade: string): string {
  switch (grade) {
    case 'A': return '🏆'
    case 'B': return '✨'
    case 'C': return '📊'
    case 'D': return '⚠️'
    default:  return '🚨'
  }
}

export const FinancialHealthGauge = ({ healthScore }: FinancialHealthGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    let frame: number
    const start = performance.now()
    const duration = 1200
    const target = healthScore.score

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * target))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [healthScore.score])

  const fillLength = (animatedScore / 100) * ARC_LENGTH
  const color = getGaugeColor(animatedScore)

  return (
    <section className="panel reveal delay-5 health-gauge-panel">
      <div className="panel-heading">
        <h2>Financial Health Score</h2>
        <p>Real-time composite score based on your spending patterns.</p>
      </div>

      <div className="health-gauge-content">
        <div className="gauge-container">
          <svg
            viewBox="0 0 200 200"
            className="gauge-svg"
            role="img"
            aria-label={`Financial Health Score: ${healthScore.score} out of 100`}
          >
            {/* Background track */}
            <circle
              cx="100"
              cy="100"
              r={GAUGE_RADIUS}
              fill="none"
              stroke="var(--border)"
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(135, 100, 100)"
              opacity={0.3}
            />

            {/* Filled arc */}
            <circle
              cx="100"
              cy="100"
              r={GAUGE_RADIUS}
              fill="none"
              stroke={color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${fillLength} ${CIRCUMFERENCE}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              transform="rotate(135, 100, 100)"
              style={{
                filter: `drop-shadow(0 0 8px ${color}40)`,
                transition: 'stroke 0.4s ease',
              }}
            />

            {/* Center score text */}
            <text
              x="100"
              y="88"
              textAnchor="middle"
              className="gauge-score-text"
              fill="var(--text-primary)"
            >
              {animatedScore}
            </text>
            <text
              x="100"
              y="110"
              textAnchor="middle"
              className="gauge-label-text"
              fill={color}
            >
              {getGradeEmoji(healthScore.grade)} {healthScore.label}
            </text>
            <text
              x="100"
              y="128"
              textAnchor="middle"
              className="gauge-sublabel-text"
              fill="var(--text-muted)"
            >
              Grade: {healthScore.grade}
            </text>
          </svg>
        </div>

        <div className="health-factors">
          {healthScore.factors.map((factor) => (
            <div key={factor.name} className="health-factor-row">
              <div className="factor-header">
                <span className="factor-name">{factor.name}</span>
                <span
                  className="factor-score"
                  style={{ color: getGaugeColor(factor.score) }}
                >
                  {factor.score}
                </span>
              </div>
              <div className="factor-bar-track">
                <div
                  className="factor-bar-fill"
                  style={{
                    width: `${factor.score}%`,
                    backgroundColor: getGaugeColor(factor.score),
                  }}
                />
              </div>
              <p className="factor-tip">{factor.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
