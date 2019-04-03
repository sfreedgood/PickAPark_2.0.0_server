const express = require("express")
const Sequelize = require("sequelize")
const app = express()
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authMiddleware = require('./auth/AuthMiddleware')
const path = require('path')

require('dotenv').config()

const { User, Park, Camp } = require("./models/models/model")
const PORT = process.env.PORT

const Op = Sequelize.Op

app.use(bodyParser.json())
app.use('/users', authMiddleware.checkToken)
app.use("/", express.static("./build/"))

//get all users
app.get('/admin/users', async (req, res) => {
    try {
        const users = await User.findAll()
        res.json({ users })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//get user by username
app.get(`/admin/users/:username`, async (req, res) => {
    try {
        const user_name = req.params.username
        const user = await User.findOne({where: {user_name}})
        res.json({ user })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//check login status
app.get('/users/', async (req, res) => {
    try {
        res.status(200).json({
            message: 'user is logged in'
        })
    } catch (e) {
        res.json({message: e.message})
    }
})

//get all camps
app.get('/camps/', async (req, res) => {
    try {
        const camps = await Camp.findAll()
        res.json({ camps })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//get camp by id
app.get('/camps/:id', async (req, res) => {
    try {
        const id = req.params.id
        const camp = await Camp.findByPk(id)
        res.json({ camp })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//Get all Parks
app.get('/parks/', async (req, res) => {
    try {
        const parks = await Park.findAll()
        res.json({ parks })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//Get park by id
app.get('/parks/:id', async (req, res) => {
    try {
        const id = req.params.id
        const park = await Park.findByPk(id)
        res.json({ park })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

// Get User Parks
app.get('/users/:id/parks', async (req, res) => {
    try {
        const id = req.params.id
        const parks = await Park.findAll({
            include: [{
                model: User,
                through: {
                    where: {
                        userId: id
                    },
                }
            }],
        })
        const userParks = parks.filter(el => {
            if (el.users.length > 0 ) {
                return el
            }
        }) 

        res.json({ userParks })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//add new User Park
app.post('/users/:id/parks', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const newPark = await Park.create(req.body)   
        const user = await User.findByPk(id)
        await user.addParks(newPark)
        res.status(200).json({ message:
            "Park has been saved"
        })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

// delete User park
app.delete('/users/:userId/parks/:parkId', async (req, res) => {
    try {
        const parkId = Number(req.params.parkId)
        const userId = Number(req.params.userId)
        const parks = await Park.findAll({
            include: [{
                model: User,
                through: {
                    where: {
                        [Op.and]: [
                            { parkId: parkId },
                            { userId: userId }
                        ] 
                    },
                }
            }],
        })

        const parkToDelete = parks.find(el => {
            if (el.users.length > 0 ) {
                return el
            }
        })
        if (parkToDelete) {
            parkToDelete.destroy()
            res.json({ message: `${parkToDelete.dataValues.name} ${parkToDelete.designation} was deleted.` })
        } else {
            res.json({ message: `park ${parkToDelete} was not deleted.` })
        }
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

// Get User Camps
app.get('/users/:id/camps', async (req, res) => {
    try {
        const id = req.params.id
        const camps = await Camp.findAll({
            include: [{
                model: User,
                through: {
                    where: {
                        userId: id 
                    },
                }
            }],
        })
        const userCamps = camps.filter(el => {
            if (el.users.length > 0 ) {
                return el
            }
        }) 
        res.json({ userCamps })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//add new User Camp
app.post('/users/:id/camps', async (req, res) => {
    try {
        const id = Number(req.params.id)
        const newCamp = await Camp.create(req.body)
        const user = await User.findByPk(id)
        await user.addCamps(newCamp)
        res.status(200).json({ 
            message: "Camp has been saved"
        })

    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

//delete User Camp
app.delete('/users/:userId/camps/:campId', async (req, res) => {
    try {
        const campId = Number(req.params.campId)
        const userId = Number(req.params.userId)
        const camps = await Camp.findAll({
            include: [{
                model: User,
                through: {
                    where: {
                        [Op.and]: [
                            { campId: campId },
                            { userId: userId }
                        ] 
                    },
                }
            }],
        })
        const campToDelete = camps.find(el => {
            if (el.users.length > 0 ) {
                return el
            }
        }) 
        if (campToDelete) {
            campToDelete.destroy()
            res.json({ message: `camp ${campToDelete.name} was deleted.` })
        } else {
            res.json({ message: `camp ${campToDelete.name} was not deleted.` })
        }
    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }
})

// authentication routes
const bcrypt = require('bcrypt')
const validator = require('validator')

const secret = process.env.REACT_NATIVE_APP_SECRET

app.get('/auth', (req, res) => {
    res.json({
        message: 'auth'
    })
})

const validateUser = (user) => {

    const email = validateUserEmail(user.email)
    const password = validateUserPassword(user.password)
    const user_name = validateUserName(user.user_name)

    // return email, username & password if all valid, otherwise returns relevant errors;
    if (email === "pass" && user_name === "pass" && password === "pass") {
      return true
    } else {
      let errors = [email, user_name, password].filter(el => {
        if (el !== "pass") {
          return el
        }
      })
      return errors
    }
}

const validateUserEmail = (email) => {
  let errors = []
  validator.isEmail(email) ? true : errors.push("Please enter a valid Email");
  validator.isEmpty(email) && errors.push("Field cannot be Empty")
  if (errors.length > 0) {
    return errors
  } else {
    return "pass"
  }
}

const validateUserName = (user_name) => {
  let errors = []
  validator.isAlphanumeric(user_name) ? true : errors.push("Username cannot contain special character");
  validator.isEmpty(user_name) && errors.push("Field cannot be Empty")
  if (errors.length > 0) {
    return errors
  } else {
    return "pass"
  }
}

const validateUserPassword = (password) => {
  let errors = []
  validator.isLength(password, {min: 6}) ? true : errors.push("Password must be at least 6 characters");
  if (errors.length > 0) {
    return errors
  } else {
    return "pass"
  }
}

const getUser = async (email, user_name) => {
    let user = await User.findOne({
        where: {
            [Op.or]: [{email}, {user_name}]
        }
    })
    return user
}

// adds new user to the database then returns that user
const createUser = async (user) => {
    try {
      const newUser = await User.create(user)
      const newUserId = await User.findByPk(newUser.id)
      return newUserId
    } catch (e) {
      console.log(e)
    }

}

// handles all authentication for creating a new user 
// creates new user if successful or returns relevant errors if not
app.post('/signup', (req, res) => {
    let userInfo = validateUser(req.body)
    if ( userInfo === true ) {
      console.log("valid User")
        getUser(req.body.email, req.body.user_name)
        .then(user => {
            if(!user) {
                bcrypt.hash(req.body.password, 8) // saltRounds is number of times, more is stronger
                    .then(hash => {
                       
                        const user = {
                            email: req.body.email,
                            user_name: req.body.user_name,
                            password: hash,
                        }

                        createUser(user).then(newUserId => {
                            res.json({
                                newUserId,
                                hash,
                                message: 'created'
                            }) 
                        })
                    })
            } else {
                res.json({
                    message: 'That account already exists, please login to continue'
                })
            }
        })
    } else {
        userInfo = userInfo.concat(...userInfo)
        const errors = userInfo.filter(el => {
          if (!Array.isArray(el)){
            return el
          }
        })
        console.log(`else:`)
        console.log(errors)
        res.json({
            message: errors 
        })
    }
})

// handles all authentication of existing users
app.post('/login', (req, res) => { 
    if(validateUserEmail(req.body.email) && validateUserPassword(req.body.password)) { // check that all fields valid
        getUser(req.body.email, req.body.user_name).then(user => { //check to see if in database
            if(user){
                bcrypt.compare(req.body.password, user.password).then(result => { //compare pwds
                    if (result) { // if passwords match
                        const token = jwt.sign({user_id: user.id}, secret); //set jwt
                        res.json({
                            success: true,
                            token: token,
                            user_id: user.id,
                            message: `logged in as ${user.user_name}`
                        })
                    } else {
                        res.json({
                            message: 'Invalid Password, Please Try Again'
                        })
                    }
                })
            } else {
                res.json({
                    message: "Invalid User"
                })
            }
        })
    } else {
        res.json({
            message: "Please Sign-Up to continue"
        })
    }
})

app.listen(PORT, () => console.log(`Example app listening on ${PORT}`))