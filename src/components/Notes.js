import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

export default function Notes(props) {
    let history = useNavigate();
    const context = useContext(noteContext);
    const {notes,getNotes,editNote} = context;
    useEffect(() => {
        if(localStorage.getItem("token")) {
          getNotes();
        }
    
        else {
          history("/login");
        }
        //eslint-disable-next-line
      }, [])

    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({id : "", etitle : "", edescription : "", etag : ""})
    
    const handleClick = (e) => {
        editNote(note.id,note.etitle,note.edescription,note.etag);
        props.showAlert("Notes updated successfully", "success");
        refClose.current.click();
    }

    const onChange = (event) => {
        setNote({...note, [event.target.name] : event.target.value})
    }

    const updateNote = (currentNote) => {
        ref.current.click();
        setNote({id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag});
    }

  return (
    <>

    <AddNote showAlert={props.showAlert}/>

    <button type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal" ref={ref}>
        Launch demo modal
    </button>
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3 my-3">
                            <label htmlFor="etitle" className="form-label">Title</label>
                            <input type="text" className="form-control" id="etitle" value={note.etitle} name='etitle' aria-describedby="emailHelp" onChange={onChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="edescription" className="form-label">Description</label>
                            <input type="text" className="form-control" id="edescription" value={note.edescription} name='edescription' onChange={onChange}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="etag" className="form-label">Tag</label>
                            <input type="text" className="form-control" id="etag" value={note.etag} name='etag' onChange={onChange}/>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" disabled={note.etitle.length < 5 || note.edescription.length < 5 || note.etag.length === 0} className="btn btn-primary" onClick={handleClick}>Update Note</button>
                </div>
            </div>
        </div>
    </div>
    <div>
        <div className='row my-3'>
            <h2>Your notes</h2> 
            <div className="container"></div>
            {notes.length === 0 && <div className="container">No Notes to display</div>}
            {notes.map((note) => {
                return <NoteItem note={note} updateNote={updateNote} key={note._id} showAlert={props.showAlert}/>
            })}
        </div>
    </div>
    </>
  )
}
