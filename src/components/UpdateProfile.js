// ALL FIREBASE AUTHENTICATION FUNCTIONALITY BASED ON THE TUTORIAL BY WEB DEV SIMPLIFIED
// THIS TUTORIAL CAN BE FOUND AT https://www.youtube.com/watch?v=PKwu15ldZ7k

import React, { useRef, useState } from 'react'
import { Form, Card, Button, Alert, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import Header from './Header'
import TitleCard from './TitleCard'

export default function UpdateProfile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setLoading(true)

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setLoading(false)
            return setError('Passwords do not match')
        }

        const promises = []
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            history.push('/')
        }).catch(() => {
            setError('Failed to make changes')
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            <Header />
            <TitleCard />
            <Container className='d-flex flex-column justify-content-center' style={{ maxWidth: "400px", height: "70vh" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">
                            Update Profile
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <form onSubmit={handleSubmit}>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep current password" />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep current password" />
                            </Form.Group>
                            <Button disabled={loading} className="w-100 mt-2" type="submit">
                                Update
                            </Button>
                        </form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    <Link to="/dashboard">Nevermind</Link>
                </div>
            </Container>
        </>
    )
}

