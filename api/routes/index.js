const router = require('express').Router()
    //import handler and setting endpoints

router.use("/admin/", require("./admin"));


//not found checker
router.use((req, res, next) => {
    //req.route gets initialized if path gets matched
    if (!req.route) {
        req.status = 404
        return next(new Error('Not Found'))
    }
    next()
})

//response formatter
router.use((req, res, next) => {
    const data = req.data
    let message = null;
    if (req.message) message = req.message;
    res.send({ success: true, message, data })
})

//error handler
router.use((error, req, res, next) => {
    const message = error.message || 'Something went wrong'
    const status = req.status || 500
    res.status(status).send({ success: false, message: message, data: null })
})

module.exports = router