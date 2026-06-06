import readInventario from "../../repositories/inventario/readInventario.js";

const alertProducto = async (req, res, next) => {
  const { stock } = req.query;
  
    try {
    const productos = await readInventario(parseInt(stock) || 5);
    res.json({ success: true, message: "Lista de productos en alerta", data: productos });
  } catch (error) {
    next(error);
  }
};

export default alertProducto;
