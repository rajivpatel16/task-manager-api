const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true
})


// const me  = new User ({
//     name: 'Rajiv',
//     email: 'rajivpatel16@gmail.com',
//     password: 'phone@123',
//     age: 23

// });
// me.save().then(() => {
//     console.log(me)
// }).catch((e) => {
//     console.log(e)
// })

// Task Table


// const task = new Task({
//     description: 'Learn the mongooes',
//     completed: true
// })
// task.save().then(() => {
//     console.log(task)
// }).catch((e) => {
//     console.log(e)
// })