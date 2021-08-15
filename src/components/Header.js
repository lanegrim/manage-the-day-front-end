import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import { Alert, Nav } from 'react-bootstrap'

export default function Header() {
    const { currentUser, logout } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleLogout() {
        setError('')
        setLoading(true)

        try {
            await logout()
            setLoading(false)
            history.push('/login')
        } catch {
            setError('Failed to log out')
            setLoading(false)
        }
    }

    return (
        <Nav variant="pills" className='header'>
            <div className='nav-buttons-left'>
                <Nav.Item disabled={loading} className='nav-button'>
                    <Nav.Link active href='/dashboard'>
                        My Profile
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item onClick={handleLogout} disabled={loading} className='nav-button'>
                    <Nav.Link active>
                        Log Out {error && <Alert variant="danger">{error}</Alert>}
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item disabled={loading} className='nav-button'>
                    <Nav.Link active href='/'>
                        Home
                    </Nav.Link>
                </Nav.Item>
            </div>
            Logged in as {currentUser.email}
        </Nav >
    )
}
