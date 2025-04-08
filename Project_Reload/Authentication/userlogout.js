

const GetLogout = (req, res) => {
    res.clearCookie('token');

    return res.status(200).json({
        message: 'Successfully logged out.',
        loggedIn: false
    })
}

export { GetLogout }