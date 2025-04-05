

const GetLogout = (req, res) => {
    res.clearCookie('token');
    console.log('asdfkjksadklfjkasldjflkasdjflksad;lkj');

    res.status(200).json({
        message: 'Successfully logged out.',
        loggedIn: false
    })
}

export { GetLogout }