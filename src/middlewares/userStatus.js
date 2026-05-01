export default (req, res, next) => {
  const status = req.usuario.estado;
  if (!status) {
    return res.status(403).json({
      success: false,
      message: "Usuario no autorizado",
    });
  }
  next();
};
