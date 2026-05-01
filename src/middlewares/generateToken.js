import jwt from "jsonwebtoken";

export default (req, res, next) => {
    const token = jwt.sign({
        nombre: req.usuario.nombre,
        apellido: req.usuario.apellido,
        correo: req.usuario.correo,
        estado: req.usuario.estado ?? true,
        id_tipo_usuario: req.usuario.id_tipo_usuario
    },
    process.env.JWT_SECRET, { expiresIn: "24h" });

    req.token = token;
    next();
};
