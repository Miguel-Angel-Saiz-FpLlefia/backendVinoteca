const Pedido = require("../models/Pedido");
const User = require("../models/User"); // <--- ASEGÚRATE DE IMPORTAR EL MODELO USER
const Vino = require("../models/modeloVino");
const Cerveza = require("../models/modelCerveza");
const mongoose = require("mongoose");
const transporter = require("../config/mailer");

const modeloPorProducto = {
  Vino,
  Cerveza,
};

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// 1. Función para crear pedido
const crearPedido = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const usuarioEncontrado = await User.findById(req.user.id).session(session);

    if (!usuarioEncontrado) {
      await session.abortTransaction();
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const productos = Array.isArray(req.body.productos)
      ? req.body.productos
      : [];
    const productosNormalizados = productos.map((producto) => ({
      productoId: producto.productoId,
      productoModelo: producto.productoModelo,
      cantidad: producto.cantidad ?? 1,
      precioUnidad: producto.precioUnidad,
    }));

    const productosInvalidos = productosNormalizados.filter(
      (producto) =>
        !producto.productoId ||
        !["Vino", "Cerveza"].includes(producto.productoModelo) ||
        typeof producto.precioUnidad !== "number" ||
        typeof producto.cantidad !== "number" ||
        producto.cantidad < 1,
    );

    if (productosInvalidos.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        msg: "Cada producto del pedido debe incluir productoId, productoModelo válido, cantidad y precioUnidad",
      });
    }

    const productosConDetalle = [];

    for (const producto of productosNormalizados) {
      const Modelo = modeloPorProducto[producto.productoModelo];
      const actualizado = await Modelo.findOneAndUpdate(
        {
          _id: producto.productoId,
          stock: { $gte: producto.cantidad },
        },
        { $inc: { stock: -producto.cantidad } },
        { returnDocument: "after", session },
      );

      if (!actualizado) {
        await session.abortTransaction();
        return res.status(409).json({
          msg: `No hay stock suficiente para el producto ${producto.productoId}`,
        });
      }

      const nombreProducto =
        actualizado.nom ||
        actualizado.name ||
        `${producto.productoModelo} ${String(producto.productoId).slice(-6)}`;

      productosConDetalle.push({
        ...producto,
        nombreProducto,
      });
    }

    const nuevoPedido = new Pedido({
      user: req.user.id,
      productos: productosNormalizados,
      total: req.body.total,
    });

    const pedidoGuardado = await nuevoPedido.save({ session });

    await session.commitTransaction();

    // ENVIAR EMAIL sin bloquear el pedido si el SMTP falla
    if (transporter) {
      try {
        const destinatarioAviso =
          process.env.EMAIL_NOTIFY_TO || process.env.EMAIL_USER;
        const lineasProductos = productosConDetalle
          .map((producto) => {
            return `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                  <div style="font-weight:700;">${escapeHtml(producto.nombreProducto)}</div>
                  <div style="font-size:12px;color:#6b7280;">${escapeHtml(producto.productoModelo)}</div>
                </td>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:center;">${producto.cantidad}</td>
                <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${Number(producto.precioUnidad).toFixed(2)} €</td>
              </tr>
            `;
          })
          .join("");

        await transporter.sendMail({
          from: '"Mi Tienda 🚀" <noreply@mitienda.com>',
          to: destinatarioAviso,
          subject: `Nuevo pedido de ${usuarioEncontrado.nombre}`,
          html: `
            <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;color:#111827;">
              <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 10px 30px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#7b001f,#1f2937);padding:28px 32px;color:#fef3c7;">
                  <h1 style="margin:0;font-size:28px;line-height:1.2;">Nuevo pedido recibido</h1>
                  <p style="margin:8px 0 0 0;font-size:15px;opacity:0.9;">El usuario <strong>${escapeHtml(usuarioEncontrado.nombre)}</strong> ha realizado una compra.</p>
                </div>
                <div style="padding:32px;">
                  <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-bottom:28px;">
                    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px;">
                      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;margin-bottom:6px;">Pedido</div>
                      <div style="font-size:16px;font-weight:700;word-break:break-word;">#${pedidoGuardado._id}</div>
                    </div>
                    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px;">
                      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;margin-bottom:6px;">Cliente</div>
                      <div style="font-size:16px;font-weight:700;word-break:break-word;">${escapeHtml(usuarioEncontrado.nombre)}</div>
                    </div>
                    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:16px;">
                      <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#6b7280;margin-bottom:6px;">Total</div>
                      <div style="font-size:16px;font-weight:700;word-break:break-word;">${Number(pedidoGuardado.total).toFixed(2)} €</div>
                    </div>
                  </div>

                  <h2 style="font-size:18px;margin:0 0 12px 0;">Resumen de compra</h2>
                  <table style="width:100%;border-collapse:collapse;">
                    <thead>
                      <tr>
                        <th style="padding:10px 0;text-align:left;border-bottom:2px solid #e5e7eb;">Producto</th>
                        <th style="padding:10px 0;text-align:center;border-bottom:2px solid #e5e7eb;">Cantidad</th>
                        <th style="padding:10px 0;text-align:right;border-bottom:2px solid #e5e7eb;">Precio unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${lineasProductos}
                    </tbody>
                  </table>

                  <div style="margin-top:28px;padding:18px 20px;background:#fff7ed;border:1px solid #fed7aa;border-radius:14px;">
                    <div style="font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:#9a3412;margin-bottom:6px;">Estado</div>
                    <div style="font-size:16px;font-weight:700;color:#7c2d12;">Pedido procesado correctamente</div>
                  </div>
                </div>
              </div>
            </div>
          `,
        });
      } catch (mailError) {
        console.warn(
          `No se pudo enviar el email del pedido ${pedidoGuardado._id}: ${mailError.message}`,
        );
      }
    } else {
      console.warn(
        `Mailer desactivado temporalmente: no se envía email para el pedido ${pedidoGuardado._id}`,
      );
    }

    res.status(201).json(pedidoGuardado);
  } catch (error) {
    try {
      await session.abortTransaction();
    } catch {
      // No-op: si la transacción ya se cerró o no llegó a iniciarse, no hacemos nada.
    }
    console.error(error);
    res.status(500).json({ msg: "Error al procesar el pedido" });
  } finally {
    session.endSession();
  }
};

// 2. Función para obtener pedidos (FUERA de la anterior)
const getMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ user: req.user.id }).populate(
      "productos.productoId",
    );
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener pedidos" });
  }
};

// 3. Exportación correcta
module.exports = {
  crearPedido,
  getMisPedidos,
};
