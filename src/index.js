const express = require('express');
require('./db/mangoose');
const userRouter = require('./routers/user');
const taskRoter = require('./routers/task');
const app = express();

const port = process.env.PORT

// app.use((req, res, next) => {
//     // console.log(req.method, req.path)
//     // //next()
//     if(req.method === 'GET') {
//         res.send('Disable get request')
//     } else {
//       next()  
//     }
// })

// const multer = require('multer');
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if(!file.originalname.match(/\.(doc|docx)$/)) {
//             cb(new Error('Please upload word document'))
//         }
//         cb(undefined, true)
//     }
// })


// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRoter)

app.listen(port, () => {
    console.log('server is up on ' + port)
})