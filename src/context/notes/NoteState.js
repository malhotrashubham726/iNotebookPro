import { useState } from 'react';
import NoteContext from './noteContext';

const NoteState = (props) => {

  const host = "http://localhost:5000";

    const notesInitial = [];

    const [notes,setNotes] = useState(notesInitial);

    // Get all notes
    const getNotes = async() => {

      const response = await fetch(`${host}/api/notes/fetchallnotes` , {
        method : "POST",
        headers : {
          "auth-token" : localStorage.getItem('token')
        },
      })
      const json = await response.json();
      setNotes(json);
    }

    // Add a note 
    const addNote = async (title,description,tag) => {
    
      const response = await fetch(`${host}/api/notes/addnote` , {
        method : "POST",
        headers : {
          "Content-type" : "application/json",
          "auth-token" : localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag})
      })

      const json = await response.json();
      setNotes(notes.concat(json));
    }

    // Delete a note
    const deleteNote = async(id) =>{

      const response = await fetch(`${host}/api/notes/deletenote/${id}` , {
        method : "DELETE",
        headers :{
          "auth-token" : localStorage.getItem('token')
        }
      })

      const json = await response.json();
      console.log(json);
      let newNotes = notes.filter((note) => {
        return note._id !== id
      })
      setNotes(newNotes);
    }

    // Edit a note
    const editNote = async (id,title,description,tag) => {
      // API Call
      const response = await fetch(`${host}/api/notes/updatenote/${id}` , {
        method : "PUT",
        headers : {
          "Content-type" : "application/json",
          "auth-token" : localStorage.getItem('token')
        },
        body: JSON.stringify({title,description,tag})
      })

      const json = await response.json();
      console.log(json);

      let newNotes = JSON.parse(JSON.stringify(notes));
      //Logic to edit in client
      for(let index=0; index < newNotes.length; index++) {
        let element = newNotes[index];
        if(element._id === id) {
          element.title = title;
          element.description = description;
          element.tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    }

    return (
        <NoteContext.Provider value={{notes,setNotes,getNotes,deleteNote,addNote,editNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;