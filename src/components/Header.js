import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import { Button, Alert, Nav } from 'react-bootstrap'

export default function Header() {
    const { currentUser, logout } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.push('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    return (
        <Nav variant="pills">
            <Nav.Item onClick={handleLogout} disabled={loading} >
                <Nav.Link active>
                    Log Out {error && <Alert variant="danger">{error}</Alert>}
                </Nav.Link>
            </Nav.Item>
            <Nav.Item disabled={loading} >
                <Nav.Link active href='/dashboard'>
                    My Profile
                </Nav.Link>
            </Nav.Item>
        </Nav>
    )
}
