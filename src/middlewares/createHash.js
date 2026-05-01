import bcryptjs from "bcryptjs";

export default (req, res, next) => {
    const { contrasena } = req.body;
    if (!contrasena) return res.status(400).json({ message: "La contraseña es requerida" });
    const hashPass = bcryptjs.hashSync(contrasena, 10);
    req.usuario.contrasena = hashPass;
    next();
}