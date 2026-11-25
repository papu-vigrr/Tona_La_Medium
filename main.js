document.addEventListener("DOMContentLoaded", () => {

    // MENÚ HAMBURGUESA
    const botonMenu = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-principal");

    if (botonMenu && menu) {
        botonMenu.addEventListener("click", () => {
            menu.classList.toggle("activo");

            const abierto = menu.classList.contains("activo");

            botonMenu.setAttribute("aria-expanded", abierto);
            botonMenu.setAttribute(
                "aria-label",
                abierto ? "Cerrar menú" : "Abrir menú"
            );
        });
    }

    // ELEMENTOS DEL CARRITO
    const botonCarrito = document.getElementById("cart-toggle");
    const panelCarrito = document.getElementById("carrito-panel");
    const listaCarrito = document.getElementById("lista-carrito");
    const contadorCarrito = document.getElementById("contador-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonComprar = document.getElementById("comprar-carrito");

    // ELEMENTOS DEL FORMULARIO DE COMPRA
    const panelCompra = document.getElementById("checkout-panel");
    const formularioCompra = document.getElementById("formulario-compra");
    const botonCancelar = document.getElementById("cancelar-compra");
    const mensajeCompra = document.getElementById("mensaje-compra");

    // RECUPERAR EL CARRITO
    let carrito = [];

    try {
        carrito = JSON.parse(localStorage.getItem("carritoTona")) || [];
    } catch (error) {
        carrito = [];
    }

    // FORMATO DE PRECIOS
    function formatoPrecio(cantidad) {
        return new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN"
        }).format(cantidad);
    }

    // ACTUALIZAR EL CARRITO
    function actualizarCarrito() {

        if (!listaCarrito) {
            return;
        }

        listaCarrito.innerHTML = "";

        let total = 0;
        let cantidadTotal = 0;

        carrito.forEach((producto, indice) => {

            total += producto.precio * producto.cantidad;
            cantidadTotal += producto.cantidad;

            const elemento = document.createElement("li");

            const informacion = document.createElement("span");
            informacion.textContent =
                producto.nombre + " x" + producto.cantidad +
                " - " + formatoPrecio(producto.precio * producto.cantidad);

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.className = "eliminar-producto";
            botonEliminar.dataset.indice = indice;

            elemento.appendChild(informacion);
            elemento.appendChild(botonEliminar);

            listaCarrito.appendChild(elemento);
        });

        if (carrito.length === 0) {
            const mensaje = document.createElement("li");
            mensaje.textContent = "Tu carrito está vacío.";
            listaCarrito.appendChild(mensaje);
        }

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidadTotal;
        }

        if (totalCarrito) {
            totalCarrito.textContent = formatoPrecio(total);
        }

        if (botonComprar) {
            botonComprar.disabled = carrito.length === 0;
        }

        if (botonVaciar) {
            botonVaciar.disabled = carrito.length === 0;
        }

        localStorage.setItem("carritoTona", JSON.stringify(carrito));
    }

    // AGREGAR PRODUCTOS AL CARRITO
    const botonesAgregar = document.querySelectorAll(".btn-carrito");

    botonesAgregar.forEach((boton) => {

        boton.addEventListener("click", () => {

            const producto = boton.closest("article");

            if (!producto) {
                return;
            }

            const nombre = producto.querySelector("h3").textContent;

            const textoPrecio = Array.from(
                producto.querySelectorAll("p")
            ).find((parrafo) => parrafo.textContent.includes("Precio:"));

            if (!textoPrecio) {
                return;
            }

            const precio = Number(
                textoPrecio.textContent.replace(/[^\d]/g, "")
            );

            const productoExistente = carrito.find(
                (elemento) => elemento.nombre === nombre
            );

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                carrito.push({
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                });
            }

            actualizarCarrito();
        });
    });

    // ABRIR Y CERRAR EL CARRITO
    if (botonCarrito && panelCarrito) {

        botonCarrito.addEventListener("click", () => {

            panelCarrito.hidden = !panelCarrito.hidden;

            botonCarrito.setAttribute(
                "aria-expanded",
                !panelCarrito.hidden
            );
        });
    }

    // ELIMINAR UN PRODUCTO
    if (listaCarrito) {

        listaCarrito.addEventListener("click", (evento) => {

            if (evento.target.classList.contains("eliminar-producto")) {

                const indice = Number(evento.target.dataset.indice);

                carrito.splice(indice, 1);

                actualizarCarrito();
            }
        });
    }

    // VACIAR EL CARRITO
    if (botonVaciar) {

        botonVaciar.addEventListener("click", () => {

            carrito = [];

            actualizarCarrito();
        });
    }

    // ABRIR EL FORMULARIO DE COMPRA
    if (botonComprar && panelCompra && panelCarrito) {

        botonComprar.addEventListener("click", () => {

            if (carrito.length === 0) {
                return;
            }

            panelCarrito.hidden = true;
            panelCompra.hidden = false;

            if (botonCarrito) {
                botonCarrito.setAttribute("aria-expanded", "false");
            }

            panelCompra.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }

    // CANCELAR LA COMPRA
    if (botonCancelar && panelCompra) {

        botonCancelar.addEventListener("click", () => {

            panelCompra.hidden = true;

            if (mensajeCompra) {
                mensajeCompra.textContent = "";
            }
        });
    }

    // FINALIZAR LA COMPRA
    if (formularioCompra) {

        formularioCompra.addEventListener("submit", (evento) => {

            evento.preventDefault();

            if (!formularioCompra.reportValidity()) {
                return;
            }

            if (carrito.length === 0) {
                return;
            }

            if (mensajeCompra) {
                mensajeCompra.textContent =
                    "¡Gracias por tu compra! Tu pedido ha sido registrado en esta demostración.";
            }

            carrito = [];
            actualizarCarrito();

            formularioCompra.reset();
            formularioCompra.hidden = true;

            setTimeout(() => {

                if (mensajeCompra) {
                    mensajeCompra.textContent = "";
                }

                formularioCompra.hidden = false;
                panelCompra.hidden = true;

            }, 4000);
        });
    }

    // VALIDACIÓN DEL FORMULARIO DE CONTACTO
    const formularioContacto = document.getElementById("formulario-contacto");
    const mensajeFormulario = document.getElementById("mensaje-formulario");

    if (formularioContacto) {

        const correo = document.getElementById("correo");
        const telefono = document.getElementById("telefono");

        // Quitar mensajes de error al escribir
        if (correo) {
            correo.addEventListener("input", () => {
                correo.setCustomValidity("");
            });
        }

        if (telefono) {
            telefono.addEventListener("input", () => {
                telefono.setCustomValidity("");
            });
        }

        // Comprobar los datos antes de enviar
        formularioContacto.addEventListener("submit", (evento) => {

            evento.preventDefault();

            if (mensajeFormulario) {
                mensajeFormulario.textContent = "";
            }

            // Revisar el formato del correo
            const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                correo.value.trim()
            );

            if (!correoValido) {
                correo.setCustomValidity(
                    "Escribe un correo válido, por ejemplo: ejemplo@gmail.com"
                );

                correo.reportValidity();
                return;
            }

            // Revisar que el teléfono tenga 10 dígitos
            const telefonoValido = /^[0-9]{10}$/.test(
                telefono.value.trim()
            );

            if (!telefonoValido) {
                telefono.setCustomValidity(
                    "El teléfono debe contener exactamente 10 números."
                );

                telefono.reportValidity();
                return;
            }

            // Revisar los campos obligatorios
            if (!formularioContacto.checkValidity()) {
                formularioContacto.reportValidity();

                if (mensajeFormulario) {
                    mensajeFormulario.textContent =
                        "Por favor, completa correctamente todos los campos.";
                }

                return;
            }

            // Mostrar mensaje de confirmación
            if (mensajeFormulario) {
                mensajeFormulario.textContent =
                    "¡Gracias por contactarnos! Tu mensaje ha sido recibido en esta demostración.";
            }

            formularioContacto.reset();
        });

        // Limpiar el mensaje al limpiar el formulario
        formularioContacto.addEventListener("reset", () => {

            if (mensajeFormulario) {
                mensajeFormulario.textContent = "";
            }
        });
    }

    // ACTUALIZAR EL CARRITO AL ABRIR LA PÁGINA
    actualizarCarrito();

});
