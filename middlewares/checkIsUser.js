// At each endpoint, will check if it is admin.
// If not admin will route back to "/sessions/login"
// this acts as a way to prevent Basic logins from being able to create new user


const checkIsUser = (req, res, next) => {
    // if session doesnt exist
    if (!req.session.user) {
        
        return res.json(
            {status: "error", userData: false}
        )
    }

    next()
}

module.exports = checkIsUser