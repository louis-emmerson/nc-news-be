const { fetchAllUsers, fetchUser } = require("../models/user-models")

function getAllUsers(request, response){
    fetchAllUsers()
    .then((users)=>{
        response.status(200).send({users})
    })
}

function getUserByUsername(request,response, next){
    const {username} = request.params
    fetchUser(username)
    .then((user)=>{
        response.status(200).send({user})
    })
    .catch((err) =>{
        next(err)
    })
}

module.exports = {getAllUsers, getUserByUsername}