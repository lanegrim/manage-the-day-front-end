// ALL FIREBASE AUTHENTICATION FUNCTIONALITY BASED ON THE TUTORIAL BY WEB DEV SIMPLIFIED
// THIS TUTORIAL CAN BE FOUND AT https://www.youtube.com/watch?v=PKwu15ldZ7k

import React, { useRef, useState } from 'react'
import { Form, Card, Button, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Header from './Header'
import TitleCard from './TitleCard'

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Check your inbox for a password reset email')
        } catch {
            setError('Failed to reset password')
        }
        setLoading(false)
    }

    return (
        <Container style={{ maxWidth: "400px" }}>
            <TitleCard />
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">
                        Reset Password
                    </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-2" type="submit">
                            Reset Password
                        </Button>
                    </form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Log In</Link>
                    </div>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Need to create an account? <Link to="/signup">Sign Up</Link>
            </div>
        </Container>
    )
}
