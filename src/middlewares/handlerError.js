export default (err, req, res, next) => {
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: err,
  });
};
