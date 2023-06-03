const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes');
const fetchuser = require('../middleware/fetchuser');
const { body,validationResult } = require('express-validator');

//Route 1: Get all the notes using GET '/api/notes/fetchallnotes'.Login required
router.post('/fetchallnotes', fetchuser , async(req,res) => {
    try {
        const notes = await Notes.find({user : req.user.id});
        res.json(notes);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//Route 2: Add a notes using POST 'api/notes/addnote'.Login required
router.post('/addnote', fetchuser, [
    body("title","Enter a valid title").isLength({min : 3}),
    body("description","Description must be atleast 5 characters").isLength({ min : 5 })
], async(req,res) => {
    try {
        const {title, description , tag} = req.body
        const errors = validationResult(req);
        if(!errors.isEmpty) {
            return res.status(400).json({ errors : errors.array()});
        }
        const note = new Notes({
            title,description, tag ,user : req.user.id
        })
        const savedNote = await note.save()
        res.json(savedNote);
    }
    catch(error) {
        res.status(500).send("Internal server error");
    }
})

//Route 3: Update an existing note using POST: /api/notes/updatenote. Login required
router.put('/updatenote/:id' , fetchuser , async(req,res) => {
    const {title , description , tag} = req.body;

    //Create a new note object
    try {
        const newNote = {};

        if(title) {
            newNote.title = title;
        }
    
        if(description) {
            newNote.description = description;
        }
    
        if(tag) {
            newNote.tag = tag;
        }
    
        //Find a note to be updated and update it
        let note = await Notes.findById(req.params.id);
        if(!note) {
            return res.status(404).send("Not found");
        }
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
    
        note = await Notes.findByIdAndUpdate(req.params.id, {$set : newNote} , {new : true})
        return res.json(note)
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

//Route 4: Delete an existing note using POST: /api/notes/deletenote. Login required
router.delete('/deletenote/:id', fetchuser , async(req,res) => {
    try {
        let note = await Notes.findById(req.params.id)
        if(!note) {
            return res.status(404).send("Not found");
        }
    
        if(note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
    
        note = await Notes.findByIdAndDelete(req.params.id)
        return res.json({"Success": "Note has been deleted successfully"});
    }
    catch(error) {
        console.error(error.message);
        return res.status(500).send("Internal server error");
    }
})

module.exports = router;