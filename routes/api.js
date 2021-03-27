const express = require('express');
const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const studentModel = require('../model/student.model');
const router = express.Router();


function verifyToken(req,res,next) {
    if(!req.headers.authorization) {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token==='null') {
        return res.status(401).send('Unauthorized request')
    }
    let payload = jwt.verify(token, 'secretkey')
    if(!payload) {
        return res.status(401).send('Unauthorized request')
    }
    req._id = payload.subject
    next()
}

router.get('/', (req,res) => {
    res.send('From API route');
})

router.post('/register', (req,res) => {
    const userData = req.body;
    const user = new userModel(userData);

    user.save((err, registeredUser) => {
        if(err) {
            console.error(err)
        } else {
            let payload = { subject: registeredUser._id }
            let token = jwt.sign(payload, 'secretkey')
            res.status(200).send({token})
        }
    })
})

router.post('/login', (req,res) => {
    let userData = req.body;

    userModel.findOne({email: userData.email, password: userData.password}, (err, user) => {
        if(err) {
            console.error(err)
        } else {
            if(!user) {
                res.status(401).send('Invalid Email');
            } else {
                if(user.password !== userData.password) {
                    res.status(401).send('Invalid Password');
                }else {
                    let payload = { subject: user._id }
                    let token = jwt.sign(payload, 'secretkey')
                    res.status(200).send({token})
                }
            }
        }
    })
})

router.post('/students',verifyToken, (req,res) => {
    const studentData = req.body

    const student = new studentModel(studentData)

    student.save((err,savedStudent) => {
        if(err) {
            console.error(err)
        } else {
            res.status(201).send(savedStudent)
        }
    })

})

router.get('/students',verifyToken, async (req,res) => {
    try {
        const students = await studentModel.find()
        res.status(200).json(students)
    } catch(error) {
        console.log(error)
    }
})

router.delete('/students/:id', async(req,res) => {
    await studentModel.findByIdAndDelete(req.params.id).then(student => {
        res.json(student);
    }).catch(err => res.status(400).json('Error ' +err))
})

module.exports = router