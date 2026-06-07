import prisma from "../../config/database.js";
import createHistorial from "../historial/createHistorial.js";

const ACCION_CREAR_VENTA = 2;
const MAX_DESC = 191;

export default async ({ id_usuario, productos }) => {
  const totalProductos = productos.length;
  const desc = `Venta creada con ${totalProductos} producto(s)`.slice(0, MAX_DESC);

  return prisma.$transaction(async (tx) => {
    const ventas = [];

    for (const producto of productos) {
      const venta = await tx.venta.create({
        data: {
          id_usuario,
          id_inventario: producto.productoId,
          cantidad: producto.cantidad,
          precio_unitario: producto.precioUnitario,
          total: producto.cantidad * producto.precioUnitario,
        },
      });
      ventas.push(venta);

      await tx.inventario.update({
        where: { id: producto.productoId },
        data: {
          cantidad: {
            decrement: producto.cantidad,
          },
        },
      });
    }

    await createHistorial(
      {
        accion: ACCION_CREAR_VENTA,
        modulo: "Ventas",
        descripcion: desc,
        id_usuario,
      },
      tx,
    );

    return ventas;
  });
};
