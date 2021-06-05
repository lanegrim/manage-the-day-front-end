import React, { useState, useEffect, useRef } from 'react'
import { Card, Container, ListGroup, ListGroupItem, Button, Alert, Form } from 'react-bootstrap'
import axios from "axios";
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function BoardSelect() {

    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const boardNameRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [boards, setBoards] = useState([])


    const linkStyle = {
        textDecoration: 'none',
        color: 'white'
    }

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.pushState('/login')
        } catch {
            setError('Failed to log out')
        }
    }

    function getBoards() {
        axios
            .get("https://managetheday-api.herokuapp.com/boards")
            .then(
                (response) => {
                    setBoards(response.data.boards)
                    console.log(response.data.boards)
                    console.log(currentUser.email)
                },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    };

    function addBoard(event) {
        event.preventDefault()
        setLoading(true)
        const newBoard = {
            title: boardNameRef.current.value,
            owner: currentUser.email
        }
        axios.post('https://managetheday-api.herokuapp.com/boards', newBoard)
            .then((response) => {
                getBoards()
                setLoading(false)
            },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    }


    useEffect(() => {
        getBoards()
    }, [])

    return (
        <Container>
            <Card>
                <Card.Header>Select a Board</Card.Header>
                <Card.Body>
                    <ListGroup variant='flush'>
                        {boards.map((board) => {
                            if (board.owner === currentUser.email) {
                                return <ListGroupItem key={board.id}>
                                    <Button className='w-100'>
                                        <Link
                                            to={{
                                                pathname: `/boards/${board.id}`,
                                            }}
                                            style={linkStyle}>
                                            <strong>{board.title}</strong>
                                        </Link>
                                    </Button>
                                </ListGroupItem>
                            }
                        })}
                        <ListGroupItem>
                            <form onSubmit={addBoard}>
                                <Form.Group id="boardName">
                                    <Form.Label>Or Add a New Board</Form.Label>
                                    <Form.Control
                                        type="text"
                                        ref={boardNameRef}
                                        required
                                        placeholder='Name Your New Board' />
                                </Form.Group>
                                <Button className="w-100 mt-2" type="submit" variant='success'>
                                    Create Board
                                </Button>
                            </form>
                        </ListGroupItem>
                    </ListGroup>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout} disabled={loading}>Log Out</Button>
                {error && <Alert variant="danger">{error}</Alert>}
            </div>
        </Container>
    )
}
