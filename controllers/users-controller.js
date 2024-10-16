const { fetchAllUsers } = require("../models/user-models")

function getAllUsers(request, response){
    fetchAllUsers()
    .then((users)=>{
        response.status(200).send({users:users})
    })
}

module.exports = {getAllUsers}