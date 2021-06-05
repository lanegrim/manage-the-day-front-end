import React, { useState, useEffect } from 'react'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import axios from 'axios'


export default function Board() {
    const { id } = useParams()
    const [board, setBoard] = useState({ columns: [] })

    function getBoard(givenID) {
        axios
            .get(`https://managetheday-api.herokuapp.com/boards/${givenID}`)
            .then(
                (response) => {
                    console.log(response.data.board)
                    setBoard(response.data.board)
                },
                (err) => console.error(err)
            )
            .catch((error) => console.error(error));
    };

    useEffect(() => {
        fetch(`http://localhost:5000/boards/${id}`)
            .then(
                getBoard(id)
            )
    }, [id])

    return (
        <>
            <h1>{board.title}</h1>
            {board.columns.map((column) => {
                return (
                    <Card key={column.id}>
                        <Card.Header>{column.title}</Card.Header>
                        <Card.Body>
                            <ListGroup variant='flush'>
                                {column.todos.map((todo) => {
                                    return (
                                        <ListGroupItem>{todo.task}</ListGroupItem>
                                    )
                                })}

                            </ListGroup>
                        </Card.Body>
                    </Card>
                )
            })}
        </>
    )
}
