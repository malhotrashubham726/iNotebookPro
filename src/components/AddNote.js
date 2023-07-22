import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

export default function AddNote(props) {
    const context = useContext(noteContext);
    const { addNote } = context

    const [note,setNote] = useState({
        title : "",
        description : "",
        tag : "Personal"
    })

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title,note.description,note.tag);
        props.showAlert("Notes Added successfully", "success");
        setNote({title: "", description: "", tag: "Personal"})
    }

    const onChange = (event) => {
        setNote({...note, [event.target.name] : event.target.value})
    }
  return (
    <div>
        <div className="container my-3">
        <h2>Add a note</h2>
        <form>
            <div className="mb-3 my-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name='title' value={note.title} aria-describedby="emailHelp" onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onChange}/>
            </div>
            <div className="mb-3">
              <label htmlFor="tag" className="form-label">Tag</label>
              <input type="text" className="form-control" id="tag" name='tag' value={note.tag} onChange={onChange}/>
            </div>
            <button disabled={note.title.length < 5 || note.description.length < 5 || note.tag.length === 0} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
        </form>
        </div>
    </div>
  )
}
