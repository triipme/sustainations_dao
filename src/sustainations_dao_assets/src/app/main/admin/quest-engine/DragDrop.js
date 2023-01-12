// import "./styles.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

// import "bootstrap/dist/css/bootstrap.min.css";
import userdata from "./tempData.json";
import { useState } from "react";

export default function DragDrop() {
  const [users, setUsers] = useState(userdata.data);

  const handleDragEnd = (e) => {
    if (!e.destination) return;
    let tempData = Array.from(users);
    let [source_data] = tempData.splice(e.source.index, 1);
    tempData.splice(e.destination.index, 0, source_data);
    setUsers(tempData);
  };
  return (
    <div style={{border: '1px solid black'}} >
     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
      <DragDropContext onDragEnd={handleDragEnd}>
        <table className="table borderd">
          <thead>
            <tr>
              <th style={{border: '1px solid black'}}/>
              <th style={{border: '1px solid black', height: '50px', width: '100px'}}>ID</th>
              <th style={{border: '1px solid black', height: '50px', width: '100px'}}>Username</th>
              <th style={{border: '1px solid black', height: '50px', width: '100px'}}>Age</th>
              <th style={{border: '1px solid black', height: '50px', width: '100px'}}>Gender</th>
            </tr>
          </thead>
          <Droppable style={{border: '1px solid black'}} droppableId="droppable-1" >
            {(provider) => (
              <tbody
                className="text-capitalize"
                ref={provider.innerRef}
                {...provider.droppableProps}
              >
                {users?.map((user, index) => (
                  <Draggable
                    key={user.name}
                    draggableId={user.name}
                    index={index}
                  >
                    {(provider) => (
                      <tr {...provider.draggableProps} ref={provider.innerRef}>
                        <td style={{border: '1px solid black', height: '50px', width: '100px'}}{...provider.dragHandleProps}> = </td>
                        <td style={{border: '1px solid black', height: '50px', width: '100px'}}></td>
                        <td style={{border: '1px solid black', height: '50px', width: '100px'}}>{user.name}</td>
                        <td style={{border: '1px solid black', height: '50px', width: '100px'}}>{user.age}</td>
                        <td style={{border: '1px solid black', height: '50px', width: '100px'}}>{user.gender}</td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provider.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
    </div>
  );
}
