const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

router.get('/test', (req, res) => {
    res.send('From new file')
})

router.post('/users', async (req, res) => {  
    try {
        const user = new User(req.body)      
        await user.save();
        const token = await user.genrateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.genrateAuthToken();
        console.log(token)
        res.send({user, token})

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save();

        res.send()

    } catch(e) {
        console.log(e)
        res.status(500).send()

    }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
})

router.get('/users/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id })
        if (!user) {
            res.status(404).send()
        }

        res.status(201).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users', authMiddleware, async (req, res) => {

    try {
        const user = await User.find({});
        if (!user) {
            res.status(404).send()
        }

        res.status(200).send(user)

    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'age']
    const isValidOpertion = updates.every((update) => allowUpdates.includes(update))

    if(!isValidOpertion) {
        return res.status(400).send({error: 'Invalid Type'});
    }

    try {
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
        const user = await User.findById(req.user._id)
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save()

        if(!user) {
            res.status(404).send() 
        }
        res.status(200).send(user)

    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/users/me', authMiddleware, async (req, res) => {
    try {
        // const deletedUser = await User.findByIdAndDelete(id)
        // if (!deletedUser) {
        //     return res.status(404).send() 
        // }
        req.user.remove()
        res.send(req.user)

    } catch(e) {
        console.log(e)
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Please upload image file with jpg jpeg or png extension'))
        }
        cb(undefined, true)
    }

})

router.post('/users/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar/delete', authMiddleware, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar)
    } catch(e) {
        console.log(e)
        res.status(404).send()
    }
})

module.exports = router