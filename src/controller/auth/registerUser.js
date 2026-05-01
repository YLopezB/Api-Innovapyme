import createUser from "../../repositories/user/createUser.js";

export default async (req, res, next ) => {
    try {
    const usuario = req.usuario;
    const result = await createUser(usuario);
    res.status(201).json({
        message: 'Usuario creado',
        token: req.token,
        success: true,
    });
    } catch (error) {
        next(error);
    }
}