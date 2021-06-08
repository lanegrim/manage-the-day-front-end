import React, { useState, useEffect, useRef } from 'react'
import { Card, Container, ListGroup, ListGroupItem, Button, Form, Modal } from 'react-bootstrap'
import axios from "axios";
import { useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from './Header'
import TitleCard from './TitleCard';

export default function BoardSelect() {

    const { currentUser } = useAuth()
    const history = useHistory()
    const boardNameRef = useRef()
    const newBoardNameRef = useRef()
    const [loading, setLoading] = useState(false)
    const [boards, setBoards] = useState([])
    const [boardID, setBoardID] = useState('')
    const [boardName, setBoardName] = useState('')
    const [boardColumnOrder, setBoardColumnOrder] = useState([])
    const [showEditModal, setShowEditModal] = useState(false)

    function getBoards() {
        axios
            .get("https://managetheday-api.herokuapp.com/boards")
            .then(
                (response) => {
                    setBoards(response.data.boards)
                    console.log(response.data.boards)
                },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    };

    function openEditModal(event) {
        setBoardID(event.target.id)
        setBoardName(event.target.name)
        setShowEditModal(true)
        setBoardColumnOrder(boards)
    }

    function closeEditModal(event) {
        setBoardID('')
        setBoardName('')
        setShowEditModal(false)
        setBoardColumnOrder([])
    }

    function editBoard(event) {
        event.preventDefault();

        const findCurrentBoard = (event) => {
            for (let board of boards) {
                if (board.id == boardID) {
                    return board
                }
            }
        }

        let currentBoard = findCurrentBoard()

        const updatedBoard = {
            owner: currentUser.email,
            title: boardNameRef.current.value,
            columnOrder: currentBoard.columnOrder,
            collaborators: currentBoard.collaborators
        }

        axios
            .put(
                "https://managetheday-api.herokuapp.com/boards/" + boardID,
                updatedBoard
            )
            .then((response) => {
                getBoards()
                closeEditModal()
            })
            .catch((error) => console.error(error));
    }

    function deleteBoard() {
        axios
            .delete(
                "https://managetheday-api.herokuapp.com/boards/" + boardID
            )
            .then((response) => {
                getBoards()
                closeEditModal()
            });
    }

    function addBoard(event) {
        event.preventDefault()
        setLoading(true)
        const newBoard = {
            title: newBoardNameRef.current.value,
            owner: currentUser.email,
            columnOrder: [],
            collaborators: ['', '', '', '']
        }
        axios.post('https://managetheday-api.herokuapp.com/boards', newBoard)
            .then((response) => {
                getBoards()
                setLoading(false)
                event.target.reset()
            },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    }


    useEffect(() => {
        getBoards()
    }, [])

    return (
        <>
            <Header />
            <TitleCard />
            <Container className='text-center' style={{ maxWidth: "400px" }}>
                <h1>My Boards</h1>
                <Card>
                    <Card.Header>Select a Board</Card.Header>
                    <Card.Body>
                        <ListGroup variant='flush'>
                            {boards.map((board) => {
                                console.log(board)
                                if (board.owner === currentUser.email) {
                                    return <ListGroupItem key={board.id}>
                                        <Button onClick={() => { history.push(`/boards/${board.id}`) }}>
                                            <strong>{board.title}</strong>
                                            <p>Created by you</p>
                                        </Button>
                                        <Button
                                            onClick={openEditModal}
                                            id={board.id}
                                            name={board.title}> Edit </Button>
                                        <Modal show={showEditModal} onHide={closeEditModal} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Edit "{boardName}"</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <form onSubmit={editBoard}>
                                                    <Form.Group id="columnName">
                                                        <Form.Label>Board title</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            ref={boardNameRef}
                                                            required
                                                            defaultValue={boardName} />
                                                    </Form.Group>
                                                    <Button className="w-100 mt-2" type="submit" variant='success'>
                                                        Update Board
                                                </Button>
                                                </form>
                                                <Button className="w-100 mt-2" variant='danger' onClick={deleteBoard}>
                                                    Delete Board
                                                </Button>
                                            </Modal.Body>
                                        </Modal>
                                    </ListGroupItem>
                                }
                                if (board.collaborators[0].indexOf(currentUser.email) !== -1) {
                                    return <ListGroupItem key={board.id}>
                                        <Button onClick={() => { history.push(`/boards/${board.id}`) }}>
                                            <strong>{board.title}</strong>
                                            <p>Created by {board.owner}</p>
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
                                            ref={newBoardNameRef}
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
            </Container>
        </>
    )
}
