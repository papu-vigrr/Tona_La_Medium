
import { supabase } from "./supabase.js";

// ELEMENTOS DE LA PÁGINA
const listaPedidos = document.getElementById("lista-pedidos");
const mensajePedidos = document.getElementById("mensaje-pedidos");

// CARGAR LOS PEDIDOS DEL USUARIO
async function cargarPedidos() {

    listaPedidos.innerHTML = "<p>Cargando tus pedidos...</p>";

    try {

        // COMPROBAR SI EL USUARIO INICIÓ SESIÓN
        const { data: { user }, error: errorUsuario } =
            await supabase.auth.getUser();

        if (errorUsuario) {
            throw errorUsuario;
        }

        if (!user) {
            listaPedidos.innerHTML =
                "<p>Necesitas iniciar sesión para consultar tus pedidos.</p>";
            return;
        }

        // CONSULTAR LOS PEDIDOS DEL USUARIO
        const { data: pedidos, error } = await supabase
            .from("pedidos")
            .select("*")
            .eq("usuario_id", user.id)
            .order("creado_en", { ascending: false });

        if (error) {
            throw error;
        }

        // COMPROBAR SI TIENE PEDIDOS
        if (!pedidos || pedidos.length === 0) {
            listaPedidos.innerHTML =
                "<p>Aún no tienes compras registradas.</p>";
            return;
        }

        // MOSTRAR LOS PEDIDOS
        listaPedidos.innerHTML = "";

        for (const pedido of pedidos) {

            // CONSULTAR LOS PRODUCTOS DE CADA PEDIDO
            const { data: detalles, error: errorDetalles } =
                await supabase
                    .from("detalle_pedidos")
                    .select("*")
                    .eq("pedido_id", pedido.id);

            if (errorDetalles) {
                throw errorDetalles;
            }

            // CREAR TARJETA DEL PEDIDO
            const tarjeta = document.createElement("article");
            tarjeta.className = "pedido-card";

            const titulo = document.createElement("h3");
            titulo.textContent = "Pedido #" + pedido.id;

            const fecha = document.createElement("p");
            fecha.textContent =
                "Fecha: " +
                new Date(pedido.creado_en).toLocaleDateString("es-MX");

            const total = document.createElement("p");
            total.textContent =
                "Total: " +
                new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN"
                }).format(pedido.total);

            const estado = document.createElement("p");
            estado.textContent = "Estado: " + pedido.estado;

            const subtitulo = document.createElement("h4");
            subtitulo.textContent = "Productos comprados:";

            const listaProductos = document.createElement("ul");

            // MOSTRAR CADA PRODUCTO
            detalles.forEach((producto) => {

                const elemento = document.createElement("li");

                elemento.textContent =
                    producto.nombre_producto +
                    " x" + producto.cantidad +
                    " - " +
                    new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN"
                    }).format(producto.subtotal);

                listaProductos.appendChild(elemento);
            });

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(fecha);
            tarjeta.appendChild(total);
            tarjeta.appendChild(estado);
            tarjeta.appendChild(subtitulo);
            tarjeta.appendChild(listaProductos);

            listaPedidos.appendChild(tarjeta);
        }

    } catch (error) {

        console.error("Error al cargar los pedidos:", error);

        listaPedidos.innerHTML =
            "<p>No se pudieron cargar tus pedidos. Inténtalo nuevamente.</p>";
    }
}

// EJECUTAR LA FUNCIÓN
cargarPedidos();
