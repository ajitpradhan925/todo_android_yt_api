const express = require('express');
const auth = require('../middleware/user_jwt');

const Todo = require('../models/Todo');

const router = express.Router();

// desc    Create new todo task
// method POST
router.post('/', auth, async (req, res, next) => {
    try {
        const toDo = await Todo.create({ title: req.body.title, description: req.body.description, user: req.user.id});
        if(!toDo) {
            return res.status(400).json({
                success: false,
                msg: 'Something went wrong'
            });
        }

        res.status(200).json({
            success: true,
            todo: toDo,
            msg: 'Successfully created.'
        });
    } catch (error) {
        next(error);
    }
});


//desc   Fetch all todos
//mehod  GET
router.get('/', auth, async(req, res, next) => {
    try {
        const todo = await Todo.find({user: req.user.id, finished: false});

        if(!todo) {
            return res.status(400).json({ success: false, msg: 'Something error happened'});
        }

        res.status(200).json({ success: true, count: todo.length, todos: todo, msg: 'Successfully fetched'})
    } catch (error) {
        next(error);
    }
});




//desc   Fetch all todos of finished: true
//mehod  GET
router.get('/finished', auth, async(req, res, next) => {
    try {
        const todo = await Todo.find({user: req.user.id, finished: true});

        if(!todo) {
            return res.status(400).json({ success: false, msg: 'Something error happened'});
        }

        res.status(200).json({ success: true, count: todo.length, todos: todo, msg: 'Successfully fetched'})
    } catch (error) {
        next(error);
    }
});



// desc   Update a task 
// method PUT
router.put('/:id', async (req, res, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo) {
            return res.status(400).json({ success: false, msg: 'Task Todo not exits' });
        }

        toDo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true,todo: toDo, msg: 'Successfully updated' });
        
    } catch (error) {
        next(error);
    }
});

// desc Delete a task todo
// method Delete
router.delete('/:id', async (req, res, next) => {
    try {
        let toDo = await Todo.findById(req.params.id);
        if(!toDo) {
            return res.status(400).json({ success: false, msg: 'Task Todo not exits' });
        }
    
        toDo = await Todo.findByIdAndDelete(req.params.id);
    
        res.status(200).json({
            success: true, msg: 'Successfully Deleted task.'
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;