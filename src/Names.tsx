import React, { Fragment, useState, useEffect, ChangeEvent } from 'react'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import './Names.css'

const banditHost = process.env.REACT_APP_API_HOST

const Names = () => {
    let [names, setNames] = useState<Array<string>>([])
    let [newName, setNewName] = useState<string>("")

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

    function persistNames(items: Array<string>) {
        const putNames = async (url: string) => {
            try {
                let response = await fetch(url, { method: 'PUT' })
                let json = await response.json()
                console.log(json.names)
            } catch (error) {
                console.log(error)
            }
        }

        let namesString = encodeURIComponent(JSON.stringify(items))
        setNames(items)
        putNames(`${banditHost}/names?names=${namesString}`)
    }

    function handleOnDragEnd(result: any) {
        if (!result.destination) return;

        const items = Array.from(names)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        persistNames(items)
    }

    function handleClick() {
        if (!newName.length) return;

        const items = Array.from(names)
        items.push(newName)
        persistNames(items)
        setNewName("")
    }

    function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
        setNewName(e.target.value)
    }

    if (!names.length) {
        return null
    }

    return (
        <Fragment>
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
                                        {(provided) => <li className={id == 0 ? "highlight" : ""} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{name}</li>}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <input type="text" id="name" value={newName} size={Math.max(...names.map((name) => name.length))} onChange={handleOnChange}></input>{newName.length ? <button onClick={handleClick}>+</button> : null}
        </Fragment>
    )
}

export default Names
