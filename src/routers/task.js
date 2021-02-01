const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const authMiddleware = require('../middleware/auth');


router.post('/tasks', authMiddleware, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/tasks', authMiddleware, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        sort.createdAt =  req.query.sortBy === 'createdAt:desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        //const task = await Task.find({owner: req.user._id})
        res.status(200).send(req.user.tasks)
    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', authMiddleware, async (req, res) => {
    const id = req.params.id
    try {
        const task = await  Task.findOne({ _id: id, owner:  req.user._id})
        if(!task) {
            res.status(404).send()
        }
        res.send(task)

    } catch(e) {
        console.log(e)
        res.status(500).send()
    }

    // Task.findById({ _id: id }).then((task) => {
    //     if (!task) {
    //         res.status(404).send()
    //     }
    //     res.status(200).send(task)
    // }).catch((error) => {
    //     res.status(500).send(error)
    // })
});

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    const id = req.params.id
    try {
        const updates = Object.keys(req.body)
        const allowUpdates = ['description', 'completed']
        const isValidOpertion = updates.every((update) => allowUpdates.includes(update))

        if (!isValidOpertion) {
            return res.status(400).send({ error: 'Invalid Type' });
        }

        const task = await Task.findOne({_id: id, owner: req.user._id});
        if(!task) {
            res.status(404).send();
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save();
        res.status(202).send(task);

    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner:req.user._id})
        res.send(task)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

module.exports = router;