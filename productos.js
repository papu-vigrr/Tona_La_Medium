import { supabase } from './supabase.js';

async function cargarProductos() {
    const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, precio, categoria, imagen')
        .eq('activo', true);

    if (error) {
        console.error('Error al cargar productos:', error);
        return;
    }

    const tarjetas = document.querySelectorAll('article');

    tarjetas.forEach((tarjeta) => {
        const titulo = tarjeta.querySelector('h3');

        if (!titulo) return;

        const producto = data.find(
            (item) => item.nombre.trim().toLowerCase() ===
            titulo.textContent.trim().toLowerCase()
        );

        if (!producto) {
            console.warn('Producto no encontrado:', titulo.textContent);
            return;
        }

        tarjeta.dataset.productoId = producto.id;

        const precioTexto = Array.from(
            tarjeta.querySelectorAll('p')
        ).find((p) => p.textContent.includes('Precio:'));

        if (precioTexto) {
            precioTexto.textContent =
                `Precio: $${producto.precio} MXN`;
        }
    });

    console.log('Catálogo conectado:', data.length, 'productos');
}

cargarProductos();
