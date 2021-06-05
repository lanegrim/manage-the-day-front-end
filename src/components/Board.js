import React, { useState, useEffect, useRef } from 'react'
import { Card, ListGroup, ListGroupItem, Button, Modal, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'


export default function Board() {
    const { id } = useParams()
    const [board, setBoard] = useState({ columns: [], id: '' })
    const [currentItemID, setCurrentItemID] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentItemName, setCurrentItemName] = useState('')
    const columnNameRef = useRef()
    const [showEditColumnModal, setShowEditColumnModal] = useState(false)

    function getBoard(givenID) {
        axios
            .get(`https://managetheday-api.herokuapp.com/boards/${givenID}`)
            .then(
                (response) => {
                    setBoard(response.data.board)
                },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    };

    function openEditColumnModal(event) {
        setCurrentItemID(event.target.id)
        setCurrentItemName(event.target.name)
        setShowEditColumnModal(true)
    }

    function closeEditColumnModal(event) {
        setCurrentItemID('')
        setCurrentItemName('')
        setShowEditColumnModal(false)
    }

    function editColumn(event) {
        event.preventDefault();
        const updatedColumn = {
            board_id: board.id,
            title: columnNameRef.current.value
        }

        axios
            .put(
                "https://managetheday-api.herokuapp.com/columns/" + currentItemID,
                updatedColumn
            )
            .then((response) => {
                getBoard(board.id)
                closeEditColumnModal()
            })
            .catch((error) => console.error(error));
    }

    function deleteColumn() {
        axios
            .delete(
                "https://managetheday-api.herokuapp.com/columns/" + currentItemID
            )
            .then((response) => {
                getBoard(board.id)
                closeEditColumnModal()
            });
    }

    function addColumn(event) {
        event.preventDefault()
        setLoading(true)

        const newColumn = {
            title: columnNameRef.current.value,
            board_id: board.id
        }

        axios.post('https://managetheday-api.herokuapp.com/columns', newColumn)
            .then((response) => {
                getBoard(board.id)
                setLoading(false)
                event.target.reset()
            },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error))
    }


    useEffect(() => {
        fetch(`http://localhost:5000/boards/${id}`)
            .then(
                getBoard(id)
            )
    }, [id])

    return (
        <>
            <h1 className="text-center">{board.title}</h1>
            <div className="columns">
                {board.columns.map((column) => {
                    return (
                        <Card key={column.id}>
                            <Card.Header className="text-center">
                                {column.title}
                                <Button
                                    onClick={openEditColumnModal}
                                    id={column.id}
                                    name={column.title}> Edit </Button>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant='flush'>
                                    {column.todos.map((todo) => {
                                        return (
                                            <ListGroupItem key={todo.id}>{todo.task}</ListGroupItem>
                                        )
                                    })}
                                    <Modal show={showEditColumnModal} onHide={closeEditColumnModal} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Edit "{currentItemName}"</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form onSubmit={editColumn}>
                                                <Form.Group id="columnName">
                                                    <Form.Label>Column title</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        ref={columnNameRef}
                                                        required
                                                        defaultValue={currentItemName} />
                                                </Form.Group>
                                                <Button className="w-100 mt-2" type="submit" variant='success'>
                                                    Update Column
                                                </Button>
                                            </form>
                                            <Button className="w-100 mt-2" variant='danger' onClick={deleteColumn}>
                                                Delete Column
                                                </Button>
                                        </Modal.Body>
                                    </Modal>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    )
                })}
                <Card>
                    <Card.Header>Add a New Column</Card.Header>
                    <Card.Body>
                        <form onSubmit={addColumn}>
                            <Form.Group id="boardName">
                                <Form.Control
                                    type="text"
                                    ref={columnNameRef}
                                    required
                                    placeholder='Name Your New Column' />
                            </Form.Group>
                            <Button className="w-100 mt-2" type="submit" variant='success' disabled={loading}>
                                Create Column
                                </Button>
                        </form>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}
