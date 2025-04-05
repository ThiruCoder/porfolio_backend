

const AdminAuth = (req, res) => {
    res.status(200).json({
        userInfo: req.userInfo,
        message: 'Wellcome to the admin page.',
        success: true
    })
}

export { AdminAuth }