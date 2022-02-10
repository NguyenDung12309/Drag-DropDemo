import './App.css';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import {React, useState} from 'react';
import { v4 as uuidv4 } from 'uuid'; //  create a random UUID
/** 
  @info DragDropContext: give our app the ability to use the library, where the library can now have access to the component tree.
  @info Droppable, Draggable: create a area allow provide a specific area where items can be moved around inside
*/

const itemsFromBackend = [
  //list task in ToDo columns
  {id: uuidv4(), content: "First Task"},
  {id: uuidv4(), content: "Second Task"},

]

const itemsFromBackend2 = [
  //list task in ToDo columns
  {id: uuidv4(), content: "First Task"},
  {id: uuidv4(), content: "Second Task"}
]

   //create columns with name is ToDo
const columnsFromBackend = {
    [uuidv4()]: {
      name: "ToDo",
      items: itemsFromBackend
    },
    [uuidv4()]: {
      name: "InProcess",
      items: itemsFromBackend2
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
    [uuidv4()]: {
      name: "InProcess",
      items: []
    }, 
  }
function App() {
  const [columns, setColumns] = useState(columnsFromBackend) //update columns when drop and drag
  
  const onDragEnd = (result, columns, setColumns) => {
    if(!result.destination) return //if destination return null mean not change card position so I return
    
    /**
      @info source
        index: card dragged
        droppableId: id current area drop
      @info destination
        droppableId: id target area drop
        index: position drop card
     */
    const {source, destination} = result;
    if(source.droppableId !== destination.droppableId){ //drag&drop to other table
      const sourceColumn = columns[source.droppableId]
      const destColumn = columns[destination.droppableId]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index,1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      })
    
    }else{ //drag&drop on current table
      const column = columns[source.droppableId]
      const coppiedItems = [...column.items]
      const [removed] = coppiedItems.splice(source.index, 1)
      coppiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: coppiedItems
        }
      })
    }
  }

  const renderItem = (column) => {
      return column.items.map((item, index) => {
        return ( // Required props draggableId and index
          <Draggable key={item.id} draggableId={item.id} index={index}> 
            {(provided, snapshot) => {
              return (
                <div 
                  className="dragContent"
                  ref={provided.innerRef}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                  style={{
                    backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                    ...provided.draggableProps.style
                  }}
                >
                  {item.content}
                </div>
              )
            }}
          </Draggable>
        )
      })
  }

  const renderColumns = Object.entries(columns) //return array [key, value] with each property of object 
                              .map(([id, column]) => {
                                return ( //required props droppableId and inside droppable component is function with 2 argument provided and snapshot
                                  <div key={id} className="dropContainer">
                                    <h2>{column.name}</h2>
                                    <Droppable droppableId={id}>
                                    {(provided, snapshot) => { 
                                      return (
                                        <div
                                        className="dragContainer"
                                        style={{background: snapshot.isDraggingOver ? "lightblue" : "lightgrey"}}
                                        {...provided.droppableProps} //designate which component want droppable.
                                        ref={provided.innerRef} // <Draggable /> and <Droppable /> components both require a HTMLElement to be provided to them using the innerRef property on the DraggableProvided and DroppableProvided objects.
                                        >
                                          {renderItem(column)}
                                          {provided.placeholder /*This is used to create space in the <Droppable /> as needed during a drag */}
                                        </div> 
                                      )
                                    }}
                                  </Droppable>
                                  </div>
                                )
                                })
  return (
    <div className="App">
      <DragDropContext 
        onDragEnd= {result => onDragEnd(result, columns, setColumns)} // update and arrange list items in columns when drag end
      >
        {renderColumns}
      </DragDropContext>
    </div>
  );
}

export default App;
