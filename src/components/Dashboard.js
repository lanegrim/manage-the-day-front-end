// ALL FIREBASE AUTHENTICATION FUNCTIONALITY BASED ON THE TUTORIAL BY WEB DEV SIMPLIFIED
// THIS TUTORIAL CAN BE FOUND AT https://www.youtube.com/watch?v=PKwu15ldZ7k

import React, { useState } from 'react'
import { Card, Container } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Header from './Header'
import TitleCard from './TitleCard'

export default function Dashboard() {
    const { currentUser } = useAuth()

    return (
        <>
            <Header />
            <TitleCard />
            <Container style={{ maxWidth: "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">
                            Profile
                    </h2>
                        <strong>Email:</strong> {currentUser.email}
                        <Link to='/update-profile' className="btn btn-primary w-100 mt-3" >
                            Update Profile
                    </Link>
                        <Link to='/' className="btn btn-primary w-100 mt-3" >
                            Return to Board Selection
                    </Link>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
