export default (err, req, res, next) => {
    console.log('Error:', err);
    return res.status(500).json({
        status: 500,
        success: false,
        message: "Error",
        response: err
    })
}