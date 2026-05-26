import { test, expect } from 'vitest'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import Index from './Index'

test('renders farm assistant text', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Index />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )

  expect(screen.getByText(/farming assistant/i)).toBeInTheDocument()
})

test('renders a button on homepage', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <Index />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )

  expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
})