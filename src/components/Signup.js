// ALL FIREBASE AUTHENTICATION FUNCTIONALITY BASED ON THE TUTORIAL BY WEB DEV SIMPLIFIED
// THIS TUTORIAL CAN BE FOUND AT https://www.youtube.com/watch?v=PKwu15ldZ7k

import React, { useRef, useState } from 'react'
import { Form, Card, Button, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import TitleCard from './TitleCard'

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(event) {
        event.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            history.push('/')
        } catch {
            setError('Failed to create an account')
        }
        setLoading(false)
    }

    return (
        <Container className='d-flex flex-column justify-content-center' style={{ maxWidth: "400px", height: "70vh" }}>
            <TitleCard />
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">
                        Sign Up
                    </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="password-confirm">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={passwordConfirmRef} required />
                        </Form.Group>
                        <Button disabled={loading} className="w-100 mt-2" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </Container>
    )
}
