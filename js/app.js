/* ============================================================
   app.js — punto de entrada
   Arranca cada módulo cuando el HTML ya está cargado y ofrece
   Arena.avisar(): una notificación (toast) reutilizable.
   ============================================================ */
(function () {
    'use strict';

    window.Arena = window.Arena || {};

    // Notificación emergente de Bootstrap, creada al vuelo
    Arena.avisar = function (mensaje) {
        const zona = document.getElementById('zona-toast');
        if (!zona || !window.bootstrap) { return; }
        const el = document.createElement('div');
        el.className = 'toast align-items-center';
        el.setAttribute('role', 'status');
        el.innerHTML = '<div class="d-flex"><div class="toast-body"></div>' +
            '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>';
        el.querySelector('.toast-body').textContent = mensaje;   // textContent evita inyectar HTML
        zona.appendChild(el);
        el.addEventListener('hidden.bs.toast', function () { el.remove(); });
        new bootstrap.Toast(el, { delay: 3500 }).show();
    };

    document.addEventListener('DOMContentLoaded', function () {
        Arena.carrito.actualizarContador();
        Arena.productos.iniciar();
        Arena.carrusel.iniciar();
        Arena.formulario.iniciar();
    });
})();
