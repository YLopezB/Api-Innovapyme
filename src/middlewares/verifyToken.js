import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Token no proveído",
    });
  }

  const [scheme, token] = authHeader.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Formato de token inválido",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};
