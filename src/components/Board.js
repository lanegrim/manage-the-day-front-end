import React, { useState, useEffect, useRef } from 'react'
import { Card, ListGroup, ListGroupItem, Button, Modal, Form } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from './Header'
import { useAuth } from '../contexts/AuthContext'

export default function Board() {

    //////////////////////////////////////////////////////////////////
    // VARIABLE / HOOK DECLARATIONS
    //////////////////////////////////////////////////////////////////

    const { currentUser } = useAuth()
    const { id } = useParams()
    const [board, setBoard] = useState({ columns: [], id: '' })
    const [columns, setColumns] = useState([])
    const [collaborators, setCollaborators] = useState([])
    const [boardOwner, setBoardOwner] = useState('')
    const [columnOrder, setColumnOrder] = useState([])
    let tempColumnOrder = []
    const [currentItemID, setCurrentItemID] = useState('')
    const [loading, setLoading] = useState(false)
    const [currentItemName, setCurrentItemName] = useState('')
    const [currentTodoColumn_ID, setCurrentTodoColumn_ID] = useState('')
    const columnNameRef = useRef()
    const newColumnNameRef = useRef()
    const todoNameRef = useRef()
    const todoCompletedRef = useRef()
    const collaboratorOneRef = useRef()
    const collaboratorTwoRef = useRef()
    const collaboratorThreeRef = useRef()
    const collaboratorFourRef = useRef()
    const collaboratorsButtonRef = useRef()
    const [showEditColumnModal, setShowEditColumnModal] = useState(false)
    const [showEditTodoModal, setShowEditTodoModal] = useState(false)
    const [showNewTodoModal, setShowNewTodoModal] = useState(false)
    const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false)

    //////////////////////////////////////////////////////////////////
    // GET DATA FUNCTION
    //////////////////////////////////////////////////////////////////

    const getBoard = (givenID) => {
        axios
            .get(`https://managetheday-api.herokuapp.com/boards/${givenID}`)
            .then(
                (response) => {
                    setBoard(response.data.board, console.log(response.data.board))
                    setColumns(response.data.board.columns)
                    setCollaborators(response.data.board.collaborators)
                    setBoardOwner(response.data.board.owner)
                    setColumnOrder(response.data.board.columnOrder)

                    if (response.data.board.columns.length > response.data.board.columnOrder.length) {
                        // let newColumn = response.data.board.columns[response.data.board.columns.length - 1]
                        // console.log(newColumn)
                        // setColumnOrder([...response.data.board.columnOrder, newColumn.id],
                        //     console.log(columnOrder))
                        let newColumnOrder = []
                        response.data.board.columns.map((column) => {
                            newColumnOrder.push(column.id)
                            console.log(newColumnOrder)
                        })
                        setColumnOrder(newColumnOrder)
                    }
                },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    };

    //////////////////////////////////////////////////////////////////
    // OPEN / CLOSE MODALS FUNCTIONS
    //////////////////////////////////////////////////////////////////

    const openEditColumnModal = (event) => {
        setCurrentItemID(event.currentTarget.id)
        setCurrentItemName(event.currentTarget.name)
        setShowEditColumnModal(true)
    }

    const closeEditColumnModal = (event) => {
        setCurrentItemID('')
        setCurrentItemName('')
        setShowEditColumnModal(false)
    }

    const openEditTodoModal = (event) => {
        setCurrentItemID(event.currentTarget.id)
        setCurrentItemName(event.currentTarget.name)
        setCurrentTodoColumn_ID(event.currentTarget.parentNode.id)
        setShowEditTodoModal(true)
    }

    const closeEditTodoModal = (event) => {
        setCurrentItemID('')
        setCurrentItemName('')
        setCurrentTodoColumn_ID('')
        setShowEditTodoModal(false)
    }

    const openNewTodoModal = (event) => {
        setCurrentTodoColumn_ID(event.target.id)
        setShowNewTodoModal(true)
    }

    const closeNewTodoModal = (event) => {
        setCurrentTodoColumn_ID('')
        setShowNewTodoModal(false)
    }

    const openCollaboratorsModal = (event) => {
        if (currentUser.email === boardOwner) {
            setShowCollaboratorsModal(true)
        }
        console.log(collaborators)
    }

    const closeCollaboratorsModal = (event) => {
        setShowCollaboratorsModal(false)
    }

    //////////////////////////////////////////////////////////////////
    // UPDATE COLUMN ORDER IN DB ON SAVE
    //////////////////////////////////////////////////////////////////

    const updateColumnOrder = () => {
        let updatedBoard = {
            owner: boardOwner,
            title: board.title,
            columnOrder: tempColumnOrder,
            collaborators: board.collaborators
        }

        console.log(updatedBoard)

        axios
            .put(
                "https://managetheday-api.herokuapp.com/boards/" + board.id,
                updatedBoard
            )
            .then((response) => {
            })
            .catch((error) => console.error(error))
    }



    //////////////////////////////////////////////////////////////////
    // COLUMN CRUD FUNCTIONS
    //////////////////////////////////////////////////////////////////

    const editColumn = (event) => {
        event.preventDefault();
        const updatedColumn = {
            board_id: board.id,
            title: columnNameRef.current.value,
            todoOrder: []
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

    const deleteColumn = () => {
        axios
            .delete(
                "https://managetheday-api.herokuapp.com/columns/" + currentItemID
            )
            .then((response) => {
                getBoard(board.id)
                closeEditColumnModal()
            });
    }

    const addColumn = (event) => {
        event.preventDefault()
        setLoading(true)

        const newColumn = {
            title: newColumnNameRef.current.value,
            board_id: board.id,
            todoOrder: []
        }

        axios.post('https://managetheday-api.herokuapp.com/columns', newColumn)
            .then((response) => {
                setLoading(false)
                getBoard(board.id)
                event.target.reset()
            },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error))
    }

    //////////////////////////////////////////////////////////////////
    // TODO CRUD FUNCTIONS
    //////////////////////////////////////////////////////////////////

    const editTodo = (event) => {
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

    const deleteTodo = () => {
        axios
            .delete(
                "https://managetheday-api.herokuapp.com/todos/" + currentItemID
            )
            .then((response) => {
                getBoard(board.id)
                closeEditTodoModal()
            });
    }

    const addTodo = (event) => {
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

    const isComplete = (todo) => {
        if (todo.completed === true) {
            return <img alt='Checked' src='/outline_check_box_black_24dp.png' className='checkmark'></img>
        } else {
            return <img alt='Unchecked' src='/outline_check_box_outline_blank_black_24dp.png' className='checkmark'></img>
        }
    }

    //////////////////////////////////////////////////////////////////
    // ADD AND REMOVE COLLABORATORS
    //////////////////////////////////////////////////////////////////
    const editBoard = (event) => {
        event.preventDefault()


        const collaboratorArray = [
            collaboratorOneRef.current.value,
            collaboratorTwoRef.current.value,
            collaboratorThreeRef.current.value,
            collaboratorFourRef.current.value
        ]


        const updatedBoard = {
            owner: boardOwner,
            title: board.title,
            columnOrder: board.columnOrder,
            collaborators: collaboratorArray
        }

        console.log(updatedBoard)

        axios
            .put(
                "https://managetheday-api.herokuapp.com/boards/" + board.id,
                updatedBoard
            )
            .then((response) => {
                closeCollaboratorsModal()
                getBoard(board.id)
            })
            .catch((error) => console.error(error));
    }

    if (currentUser.email === boardOwner) {
        var CollaboratorsButton = (
            <Button onClick={openCollaboratorsModal} ref={collaboratorsButtonRef}>Add Collaborators</Button>
        )
    }


    //////////////////////////////////////////////////////////////////
    // EFFECTS
    //////////////////////////////////////////////////////////////////

    useEffect(() => {
        fetch(`http://localhost:5000/boards/${id}`)
            .then(getBoard(id))
    }, [])

    //////////////////////////////////////////////////////////////////
    // RENDER
    //////////////////////////////////////////////////////////////////

    return (
        <div className="columns-page">
            <Header />
            <h1 className="text-center">{board.title}</h1>
            <Button onClick={updateColumnOrder}>Save Board</Button>
            <h4 className="text-center">Owned by: {boardOwner}</h4>
            {
                //////////////////////////////////
                // COLUMNS CONTAINER [HORIZONTAL LIST]
                //////////////////////////////////
            }
            <div className="columns">
                {columnOrder.map((columnID) => {
                    console.log(columnOrder)
                    console.log(columns)
                    console.log(columnID)
                    let columnArray = columns.filter((obj) => {
                        return (obj.id == columnID)
                    })
                    console.log(columnArray)
                    let column = columnArray[0]
                    console.log(column)
                    tempColumnOrder = [...tempColumnOrder, column.id]
                    console.log(tempColumnOrder)
                    return (
                        <Card key={columnID} className='board-column'>
                            {
                                //////////////////////////////////
                                // COLUMN CARD
                                //////////////////////////////////
                            }
                            <Card.Header className="text-center" style={{ minHeight: '75px' }}>
                                {column.title}
                                <Button className="edit-btn"
                                    onClick={openEditColumnModal}
                                    id={column.id}
                                    name={column.title}
                                >
                                    <img alt='Edit' src='/outline_edit_note_white_24dp.png' className='edit-img'></img>
                                </Button>
                            </Card.Header>
                            <Card.Body>
                                {
                                    //////////////////////////////////
                                    // TODO CARD
                                    //////////////////////////////////
                                }
                                <ListGroup variant='flush'>
                                    {column.todos.map((todo) => {
                                        return (
                                            <ListGroupItem key={todo.id} id={todo.column_id}>
                                                {isComplete(todo)}
                                                {todo.task}
                                                <Button className="edit-btn"
                                                    onClick={openEditTodoModal}
                                                    id={todo.id}
                                                    name={todo.task}
                                                >
                                                    <img alt='Edit'
                                                        src='/outline_edit_note_white_24dp.png' className='edit-img'></img>
                                                </Button>

                                                <Modal show={showEditTodoModal} onHide={closeEditTodoModal} centered>
                                                    {
                                                        //////////////////////////////////
                                                        // TODO EDIT MODAL
                                                        //////////////////////////////////
                                                    }
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
                                        {
                                            //////////////////////////////////
                                            // TODO CREATE MODAL
                                            //////////////////////////////////
                                        }
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
                                        {
                                            //////////////////////////////////
                                            // COLUMN EDIT MODAL
                                            //////////////////////////////////
                                        }
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
                }
                )}
                <Card className='board-column'>
                    {
                        //////////////////////////////////
                        // COLUMN CREATE CARD
                        //////////////////////////////////
                    }
                    <Card.Header className="text-center" style={{ minHeight: '75px' }}>
                        Add a New Column
                    </Card.Header>
                    <Card.Body>
                        <form onSubmit={addColumn}>
                            <Form.Group id="boardName">
                                <Form.Control
                                    type="text"
                                    ref={newColumnNameRef}
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
            <div>
                {CollaboratorsButton}
                <Modal show={showCollaboratorsModal} onHide={closeCollaboratorsModal} centered>
                    {
                        //////////////////////////////////
                        // COLLABORATORS MODAL
                        //////////////////////////////////
                    }
                    <Modal.Header closeButton>
                        <Modal.Title>Collaborators for {board.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Boards can have up to four collaborators in addition to the owner.</p>
                        <form onSubmit={editBoard}>
                            <Form.Group>
                                <Form.Label>Collaborator 1</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={collaboratorOneRef}
                                    defaultValue={collaborators[0]} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Collaborator 2</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={collaboratorTwoRef}
                                    defaultValue={collaborators[1]} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Collaborator 3</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={collaboratorThreeRef}
                                    defaultValue={collaborators[2]} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Collaborator 4</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={collaboratorFourRef}
                                    defaultValue={collaborators[3]} />
                            </Form.Group>
                            <Button className="w-100 mt-2" type="submit" variant='success'>
                                Update Collaborators
                            </Button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    )
}
