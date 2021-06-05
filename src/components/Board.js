import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'


export default function Board() {
    const { id } = useParams()
    const [boardID, setBoardID] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:5000/boards/${id}`)
            .then(setBoardID(id))
    }, [id])


    return (
        <div>
            <h1>{boardID}</h1>
        </div>
    )
}
