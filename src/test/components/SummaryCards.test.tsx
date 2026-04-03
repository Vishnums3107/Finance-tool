import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SummaryCards } from '../../components/SummaryCards'

describe('SummaryCards', () => {
  it('renders summary values correctly', () => {
    const mockSummary = {
      income: 5000,
      expenses: 3000,
      balance: 2000,
      transactionCount: 15,
      savingsRate: 40,
    }

    render(<SummaryCards summary={mockSummary} />)

    // Check Balance
    expect(screen.getByText('Total Balance')).toBeInTheDocument()
    expect(screen.getByText(/\$?2[\.,]?0*K/i)).toBeInTheDocument()

    // Check Income
    expect(screen.getByText('Total Income')).toBeInTheDocument()
    expect(screen.getByText(/\$?5[\.,]?0*K/i)).toBeInTheDocument()

    // Check Expenses
    expect(screen.getByText('Total Expenses')).toBeInTheDocument()
    expect(screen.getByText(/\$?3[\.,]?0*K/i)).toBeInTheDocument()

    // Check Savings Rate
    expect(screen.getByText('Savings Rate')).toBeInTheDocument()
    expect(screen.getByText('40.0%')).toBeInTheDocument()
  })

  it('renders negative balance tone correctly', () => {
    const mockSummary = {
      income: 1000,
      expenses: 3000,
      balance: -2000,
      transactionCount: 5,
      savingsRate: -200,
    }

    const { container } = render(<SummaryCards summary={mockSummary} />)

    // Verify negative tone class is applied to the balance card
    const balanceCard = container.querySelector('.summary-card:first-of-type')
    expect(balanceCard).toHaveClass('tone-negative')
  })
})
