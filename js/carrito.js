/* ============================================================
   carrito.js — carrito de compras con localStorage
   Responsabilidad única: guardar, leer y calcular el carrito.
   Patrón: IIFE (función que se ejecuta sola) para no ensuciar el
   espacio global; solo expongo lo necesario en Arena.carrito.
   ============================================================ */
(function () {
    'use strict';

    window.Arena = window.Arena || {};

    const CLAVE = 'arena_carrito';   // nombre de la llave en localStorage
    const IVU = 0.115;               // impuesto de Puerto Rico (11.5 %)
    const ENVIO_GRATIS_DESDE = 50;   // regla de envío gratis
    const COSTO_ENVIO = 5.99;

    // Leo el carrito; si el navegador bloquea localStorage uso memoria.
    let memoria = {};
    function leer() {
        try {
            return JSON.parse(localStorage.getItem(CLAVE)) || {};
        } catch (e) {
            return memoria;
        }
    }
    function guardar(carrito) {
        memoria = carrito;
        try { localStorage.setItem(CLAVE, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento */ }
        actualizarContador();
        document.dispatchEvent(new CustomEvent('carrito:cambio'));
    }

    function buscar(id) {
        return Arena.datos.productos.find(function (p) { return p.id === id; });
    }

    function agregar(id, cantidad) {
        const c = leer();
        c[id] = Math.min((c[id] || 0) + (cantidad || 1), 20);
        guardar(c);
    }
    function cambiarCantidad(id, nueva) {
        const c = leer();
        if (nueva <= 0) { delete c[id]; } else { c[id] = Math.min(nueva, 20); }
        guardar(c);
    }
    function quitar(id) { cambiarCantidad(id, 0); }
    function vaciar() { guardar({}); }

    function lineas() {
        const c = leer();
        return Object.keys(c).map(function (id) {
            const p = buscar(id);
            return p ? { producto: p, cantidad: c[id] } : null;
        }).filter(Boolean);
    }
    function totales() {
        const sub = lineas().reduce(function (s, l) { return s + l.producto.precio * l.cantidad; }, 0);
        const envio = sub === 0 ? 0 : (sub >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO);
        const impuesto = sub * IVU;
        return { subtotal: sub, impuesto: impuesto, envio: envio, total: sub + impuesto + envio, faltaEnvioGratis: Math.max(0, ENVIO_GRATIS_DESDE - sub) };
    }
    function cantidadTotal() {
        return lineas().reduce(function (s, l) { return s + l.cantidad; }, 0);
    }
    function actualizarContador() {
        const el = document.getElementById('contador-carrito');
        if (el) { el.textContent = cantidadTotal(); }
    }
    function dinero(n) {
        return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    Arena.carrito = {
        agregar: agregar, cambiarCantidad: cambiarCantidad, quitar: quitar, vaciar: vaciar,
        lineas: lineas, totales: totales, cantidadTotal: cantidadTotal, buscar: buscar,
        actualizarContador: actualizarContador, dinero: dinero, leer: leer
    };

    document.addEventListener('DOMContentLoaded', actualizarContador);
})();
