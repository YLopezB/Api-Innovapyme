import prisma from "../../config/database.js";
import createHistorial from "../historial/createHistorial.js";

const ACCION_CREAR_PRODUCTO = 1;
const MAX_DESC = 191;

export default async ({ id_usuario, productoPayload }) => {
  const nombre = productoPayload.nombre_producto;
  const desc = `Producto creado: ${nombre}`.slice(0, MAX_DESC);

  return prisma.$transaction(async (tx) => {
    const inventario = await tx.inventario.create({
      data: {
        nombre_producto: productoPayload.nombre_producto,
        descripcion: productoPayload.descripcion ?? null,
        cantidad: productoPayload.cantidad,
        precio_unitario: productoPayload.precio_unitario,
        categoria: productoPayload.categoria ?? null,
        id_usuario,
      },
    });

    await createHistorial(
      {
        accion: ACCION_CREAR_PRODUCTO,
        modulo: "Inventario",
        descripcion: desc,
        id_usuario,
      },
      tx,
    );

    return inventario;
  });
};
