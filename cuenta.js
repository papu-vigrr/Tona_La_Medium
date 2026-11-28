
import { supabase } from "./supabase.js";

// ELEMENTOS DE LA PÁGINA
const formularioLogin = document.getElementById("formulario-login");
const formularioRegistro = document.getElementById("formulario-registro");

const botonLogin = document.getElementById("mostrar-login");
const botonRegistro = document.getElementById("mostrar-registro");

const mensaje = document.getElementById("mensaje-cuenta");

// CERRAR SESIÓN
const botonCerrarSesion = document.getElementById("cerrarsesion");

if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener("click", async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            alert("No se pudo cerrar la sesión.");
            return;
        }

        alert("Sesión cerrada correctamente.");
        window.location.href = "index.html";
    });
}

// CAMBIAR ENTRE FORMULARIOS
botonLogin.addEventListener("click", () => {
    formularioLogin.hidden = false;
    formularioRegistro.hidden = true;
    mensaje.textContent = "";
});

botonRegistro.addEventListener("click", () => {
    formularioLogin.hidden = true;
    formularioRegistro.hidden = false;
    mensaje.textContent = "";
});

// REGISTRAR UNA CUENTA
formularioRegistro.addEventListener("submit", async (evento) => {

    evento.preventDefault();
    mensaje.textContent = "Creando tu cuenta...";

    const nombre = document.getElementById("nombre-registro").value.trim();
    const correo = document.getElementById("correo-registro").value.trim();
    const contrasena = document.getElementById("contrasena-registro").value;
    const confirmar = document.getElementById("confirmar-contrasena").value;

    if (contrasena !== confirmar) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    try {

        const { data, error } = await supabase.auth.signUp({
            email: correo,
            password: contrasena,
            options: {
                data: {
                    nombre_completo: nombre
                }
            }
        });

        if (error) {
            throw error;
        }

        if (data.session) {
            mensaje.textContent = "¡Tu cuenta fue creada! Ya puedes comprar.";
            setTimeout(() => {
                window.location.href = "productos.html";
            }, 1500);
        } else {
            mensaje.textContent =
                "Tu registro fue recibido. Revisa tu correo para confirmar la cuenta y después inicia sesión.";
        }

        formularioRegistro.reset();

    } catch (error) {
        console.error("Error al registrarse:", error);
        mensaje.textContent = error.message;
    }
});

// INICIAR SESIÓN
formularioLogin.addEventListener("submit", async (evento) => {

    evento.preventDefault();
    mensaje.textContent = "Iniciando sesión...";

    const correo = document.getElementById("correo-login").value.trim();
    const contrasena = document.getElementById("contrasena-login").value;

    try {

        const { data, error } = await supabase.auth.signInWithPassword({
            email: correo,
            password: contrasena
        });

        if (error) {
    console.log("Error de inicio de sesión:", error);
    console.log("Datos recibidos:", data);
    mensaje.textContent = error.message;
    return;
}

        mensaje.textContent = "¡Bienvenido! Has iniciado sesión correctamente.";

        setTimeout(() => {
            window.location.href = "productos.html";
        }, 1000);

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mensaje.textContent = error.message;
    }
});
