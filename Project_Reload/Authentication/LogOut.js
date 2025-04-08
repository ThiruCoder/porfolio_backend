

const LoggedOut = (req, res) => {
    console.log(req.logToken);

    res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
    return res.json({ success: true, message: "Logged out successfully" });
}

export { LoggedOut }