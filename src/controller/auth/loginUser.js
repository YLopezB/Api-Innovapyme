export default (req, res, next) => {
    try {
        res.status(200).json({
            message: 'Usuario logueado correctamente',
            token: req.token,
            success: true
        })
    } catch (error) {
        next(error)
    }
}