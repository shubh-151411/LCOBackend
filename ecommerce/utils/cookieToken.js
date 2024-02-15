const cookieToken = async(user, res) => {
    const token = await user.getJwtToken();

    const option = {
        expires: new Date(Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true

    }


    res.status(200).cookie('token', token, option).json({
        success: true,
        token,
        user
    })
}

module.exports = cookieToken;