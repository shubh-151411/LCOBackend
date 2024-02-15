const BigPromise = require('../middlewares/bigPromise')

exports.home = BigPromise(async (req, res) => {
    // const db = await something()
    res.status(200).json({
        sucess: true,
        message: "Hello from API"
    });
});

exports.login = async (req, res) => {

    try {
         // const db = await something()
        res.status(200).json({
            sucess: true,
            message: "Login successfully"
        })

    } catch (error) {
        console.log(error)

    }

}