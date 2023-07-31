import React, { useState, useEffect } from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import './Names.css'

const banditHost = process.env.REACT_APP_API_HOST

const Names = () => {
    let [names, setNames] = useState<Array<string>>([])

    useEffect(() => {
        let cancel = false
        const fetchNames = async (url: string) => {
            try {
                let response = await fetch(url)
                let json = await response.json()

                if (!cancel) {
                    setNames(json.names)
                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchNames(`${banditHost}/names`)
    
        return () => {
            cancel = true
        }
    }, [])

    function handleOnDragEnd(result: any) {
        if (!result.destination) return;

        const putNames = async(url:string) => {
            try {
                let response = await fetch(url, {method: 'PUT'})
                let json = await response.json()
                console.log(json.names)
            } catch (error) {
                console.log(error)
            }
        }

        const items = Array.from(names)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        let namesString = encodeURIComponent(JSON.stringify(items))
        setNames(items)
        putNames(`${banditHost}/names?names=${namesString}`)
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="names">
                {(provided) => (
                    <ul
                        className="names"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {names.map((name, id) => {
                            return (
                                <Draggable key={id} draggableId={`${id}`} index={id}>
                                    {(provided) => <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{name}</li>}
                                </Draggable>
                            )
                        })}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default Names
