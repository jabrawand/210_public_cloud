import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../../src/components/ProtectedRoute'
import { useAuth } from '../../src/context/AuthContext'

vi.mock('../../src/context/AuthContext', () => ({
    useAuth: vi.fn(),
}))

function renderProtectedRoute(initialPath = '/activities/1') {
    render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="/login" element={<div>Login Page</div>} />
                <Route
                    path="/activities/:id"
                    element={
                        <ProtectedRoute>
                            <div>Activity Details</div>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.mocked(useAuth).mockReset()
    })

    it('redirects unauthenticated users to login', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            loading: false,
        })

        renderProtectedRoute()

        expect(screen.getByText('Login Page')).toBeInTheDocument()
        expect(screen.queryByText('Activity Details')).not.toBeInTheDocument()
    })

    it('renders children for authenticated users', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            loading: false,
        })

        renderProtectedRoute()

        expect(screen.getByText('Activity Details')).toBeInTheDocument()
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
    })

    it('renders nothing while auth is loading', () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            loading: true,
        })

        renderProtectedRoute()

        expect(screen.getByText('Laden…')).toBeInTheDocument()
        expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
        expect(screen.queryByText('Activity Details')).not.toBeInTheDocument()
    })
})
