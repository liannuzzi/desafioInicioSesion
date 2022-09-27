const bCrypt=require('bcrypt')

function checkPassword(password,hash){
    return bCrypt.compareSync(password, hash)
}

function hashPassword(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10))
}

module.exports={checkPassword, hashPassword}