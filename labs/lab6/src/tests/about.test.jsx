import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import About from '../pages/About'

describe('About page', () => {
  it('renders the skills filter UI', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/search skills/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
  })
})
