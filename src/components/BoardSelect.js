import React, { useState, useEffect } from 'react'
import { Card, Container, ListGroup, ListGroupItem } from 'react-bootstrap'
import axios from "axios";

export default function BoardSelect() {

    const [boards, setBoards] = useState([])

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

    useEffect(() => {
        getBoards()
    }, [])

    return (
        <Container>
            <Card>
                <Card.Header>Select a Board</Card.Header>
                <Card.Body>
                    <ListGroup variant="flush">
                        {boards.map((board) => {
                            return <ListGroupItem key={board.id}>{board.title}</ListGroupItem>
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    )
}
