import React, { useState, useEffect, useRef } from 'react'
import { Card, ListGroup, ListGroupItem, Button, Modal, Form, Container } from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'


export default function Board() {
    const { id } = useParams()
    const [board, setBoard] = useState({ columns: [], id: '' })
    const [currentItemID, setCurrentItemID] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentItemName, setCurrentItemName] = useState('')
    const [currentTodoColumn_ID, setCurrentTodoColumn_ID] = useState('')
    const columnNameRef = useRef()
    const todoNameRef = useRef()
    const todoCompletedRef = useRef()
    const [showEditColumnModal, setShowEditColumnModal] = useState(false)
    const [showEditTodoModal, setShowEditTodoModal] = useState(false)
    const [showNewTodoModal, setShowNewTodoModal] = useState(false)

    function getBoard(givenID) {
        axios
            .get(`https://managetheday-api.herokuapp.com/boards/${givenID}`)
            .then(
                (response) => {
                    setBoard(response.data.board)
                    console.log(response.data.board)
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

    function openEditTodoModal(event) {
        setCurrentItemID(event.target.id)
        setCurrentItemName(event.target.name)
        setCurrentTodoColumn_ID(event.target.parentNode.id)
        setShowEditTodoModal(true)
    }

    function closeEditTodoModal(event) {
        setCurrentItemID('')
        setCurrentItemName('')
        setCurrentTodoColumn_ID('')
        setShowEditTodoModal(false)
    }

    function openNewTodoModal(event) {
        setCurrentTodoColumn_ID(event.target.id)
        setShowNewTodoModal(true)
    }

    function closeNewTodoModal(event) {
        setCurrentTodoColumn_ID('')
        setShowNewTodoModal(false)
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

    function editTodo(event) {
        event.preventDefault();
        let completionStatus = false
        if (todoCompletedRef.current.value === 'Completed') {
            completionStatus = true
        }

        const updatedTodo = {
            task: todoNameRef.current.value,
            column_id: currentTodoColumn_ID,
            completed: completionStatus
        }

        console.log(updatedTodo)
        axios
            .put(
                "https://managetheday-api.herokuapp.com/todos/" + currentItemID,
                updatedTodo
            )
            .then((response) => {
                getBoard(board.id)
                closeEditTodoModal()
            })
            .catch((error) => console.error(error));
    }

    function deleteTodo() {
        axios
            .delete(
                "https://managetheday-api.herokuapp.com/todos/" + currentItemID
            )
            .then((response) => {
                getBoard(board.id)
                closeEditTodoModal()
            });
    }

    function addTodo(event) {
        event.preventDefault()
        setLoading(true)

        const newTodo = {
            task: todoNameRef.current.value,
            column_id: event.target.id,
            completed: false
        }

        axios.post('https://managetheday-api.herokuapp.com/todos', newTodo)
            .then((response) => {
                getBoard(board.id)
                setLoading(false)
                closeNewTodoModal()
            },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error))
    }

    function isComplete(todo) {
        if (todo.completed === true) {
            return "COMPLETE"
        } else {
            return "INCOMPLETE"
        }
    }

    useEffect(() => {
        fetch(`http://localhost:5000/boards/${id}`)
            .then(
                getBoard(id)
            )
    }, [id])

    return (
        <Container className="columns-page">
            <h1 className="text-center">{board.title}</h1>
            <div className="w-100 text-center mt-2">
                <Link to="/">Return to Board Selector</Link>
            </div>
            <div className="columns">
                {board.columns.map((column) => {
                    return (
                        <Card key={column.id} className='board-column'>
                            <Card.Header className="text-center" style={{ minHeight: '75px' }}>
                                {column.title}
                                <Button
                                    onClick={openEditColumnModal}
                                    id={column.id}
                                    name={column.title}
                                >
                                    Edit
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                <ListGroup variant='flush'>
                                    {column.todos.map((todo) => {
                                        return (
                                            <ListGroupItem key={todo.id} id={todo.column_id}>
                                                {todo.task}
                                                <Button
                                                    onClick={openEditTodoModal}
                                                    id={todo.id}
                                                    name={todo.task}
                                                >
                                                    Edit
                                                </Button>
                                                {isComplete(todo)}
                                                <Modal show={showEditTodoModal} onHide={closeEditTodoModal} centered>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>Edit "{currentItemName}"</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <form onSubmit={editTodo} id={column.id}>
                                                            <Form.Group id="todoName">
                                                                <Form.Label>Task Name</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    ref={todoNameRef}
                                                                    required
                                                                    defaultValue={currentItemName} />
                                                            </Form.Group>
                                                            <Form.Group id="todoCompleted">
                                                                <Form.Label>Task Completed?</Form.Label>
                                                                <Form.Control
                                                                    as="select"
                                                                    ref={todoCompletedRef}
                                                                >
                                                                    <option>Incomplete</option>
                                                                    <option>Completed</option>
                                                                </Form.Control>
                                                            </Form.Group>
                                                            <Button className="w-100 mt-2" type="submit" variant='success'>
                                                                Update Task
                                                </Button>
                                                        </form>
                                                        <Button className="w-100 mt-2" variant='danger' onClick={deleteTodo}>
                                                            Delete Task
                                                </Button>
                                                    </Modal.Body>
                                                </Modal>
                                            </ListGroupItem>
                                        )
                                    })}
                                    <ListGroupItem>
                                        <Button
                                            className="w-100 mt-2"
                                            onClick={openNewTodoModal}
                                            id={column.id}>
                                            Add a New Task
                                            </Button>
                                    </ListGroupItem>
                                    <Modal show={showNewTodoModal} onHide={closeNewTodoModal} centered>
                                        <Modal.Header closeButton>Add a New Task</Modal.Header>
                                        <Modal.Body>
                                            <form onSubmit={addTodo} id={currentTodoColumn_ID}>
                                                <Form.Group id="todoName">
                                                    <Form.Control
                                                        type="text"
                                                        ref={todoNameRef}
                                                        required
                                                        placeholder='Name Your New Task' />
                                                </Form.Group>
                                                <Button className="w-100 mt-2" type="submit" variant='success' disabled={loading}>
                                                    Create Task
                                            </Button>
                                            </form>
                                        </Modal.Body>
                                    </Modal>
                                    <Modal show={showEditColumnModal} onHide={closeEditColumnModal} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Edit "{currentItemName}"</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form onSubmit={editColumn} id="columnName">
                                                <Form.Group>
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
                <Card className='board-column'>
                    <Card.Header className="text-center" style={{ minHeight: '75px' }}>
                        Add a New Column
                    </Card.Header>
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
        </Container>
    )
}
