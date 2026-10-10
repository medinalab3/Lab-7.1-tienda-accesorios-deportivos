/* ============================================================
   productos.js — interacciones con los productos
   1. Resaltar un producto al pasar el mouse (o al enfocarlo con teclado).
   2. Mostrar los detalles en un modal al hacer clic.
   3. Botón "Añadir al carrito".
   4. Filtros, búsqueda y orden del catálogo.
   5. Página de detalle (producto.html?id=p01) y carrito.html.
   Uso "delegación de eventos": un solo listener en el contenedor
   en vez de uno por cada tarjeta (más eficiente y funciona con
   tarjetas creadas después).
   ============================================================ */
(function () {
    'use strict';

    window.Arena = window.Arena || {};

    function esc(t) {
        const d = document.createElement('div');
        d.textContent = t;
        return d.innerHTML;
    }

    /* ---------- 1. Resaltado al pasar el mouse ---------- */
    function iniciarResaltado() {
        document.querySelectorAll('.row[id^="grid-"]').forEach(function (grid) {
            function activar(tarjeta) {
                grid.classList.add('hay-resaltado');
                tarjeta.classList.add('resaltado');
            }
            function desactivar() {
                grid.classList.remove('hay-resaltado');
                grid.querySelectorAll('.resaltado').forEach(function (t) { t.classList.remove('resaltado'); });
            }
            // mouseover/mouseout "burbujean", así que sirven para delegar
            grid.addEventListener('mouseover', function (e) {
                const t = e.target.closest('.card.producto');
                if (t && grid.contains(t)) { desactivar(); activar(t); }
            });
            grid.addEventListener('mouseleave', desactivar);
            // También para quien usa teclado (accesibilidad)
            grid.addEventListener('focusin', function (e) {
                const t = e.target.closest('.card.producto');
                if (t) { desactivar(); activar(t); }
            });
            grid.addEventListener('focusout', desactivar);
        });
    }

    /* ---------- 2. Modal de detalles al hacer clic ---------- */
    let productoModal = null;
    function abrirModal(id) {
        const p = Arena.carrito.buscar(id);
        const el = document.getElementById('modal-producto');
        if (!p || !el || !window.bootstrap) { return; }
        productoModal = p;
        document.getElementById('modal-titulo').textContent = p.nombre;
        const img = document.getElementById('modal-imagen');
        img.src = p.imagen;
        img.alt = p.nombre;
        document.getElementById('modal-cat').textContent = p.catNombre;
        document.getElementById('modal-desc').textContent = p.desc;
        document.getElementById('modal-specs').innerHTML = p.specs.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
        const ant = p.anterior ? ' <span class="precio-anterior">' + Arena.carrito.dinero(p.anterior) + '</span>' : '';
        document.getElementById('modal-precio').innerHTML = Arena.carrito.dinero(p.precio) + ant;
        document.getElementById('modal-enlace').href = 'producto.html?id=' + encodeURIComponent(p.id);
        bootstrap.Modal.getOrCreateInstance(el).show();
    }

    function iniciarClics() {
        document.addEventListener('click', function (e) {
            const boton = e.target.closest('.btn-agregar');
            if (boton) {                       // clic en "Añadir": no abrir el modal
                e.stopPropagation();
                agregarYAvisar(boton.dataset.id);
                return;
            }
            const tarjeta = e.target.closest('.card.producto');
            if (tarjeta) { abrirModal(tarjeta.dataset.id); }
        });
        document.addEventListener('keydown', function (e) {
            const tarjeta = e.target.closest && e.target.closest('.card.producto');
            if (tarjeta && e.target === tarjeta && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                abrirModal(tarjeta.dataset.id);
            }
        });
        const btnModal = document.getElementById('modal-agregar');
        if (btnModal) {
            btnModal.addEventListener('click', function () {
                if (productoModal) { agregarYAvisar(productoModal.id); }
            });
        }
    }

    function agregarYAvisar(id) {
        const p = Arena.carrito.buscar(id);
        if (!p) { return; }
        Arena.carrito.agregar(id, 1);
        if (Arena.avisar) { Arena.avisar('"' + p.nombre + '" se añadió al carrito.'); }
    }

    /* ---------- 4. Filtros del catálogo ---------- */
    function iniciarFiltros() {
        const grid = document.getElementById('grid-productos');
        const buscar = document.getElementById('buscar');
        if (!grid || !buscar) { return; }
        const cat = document.getElementById('filtro-cat');
        const orden = document.getElementById('orden');
        const total = document.getElementById('total-resultados');
        const vacio = document.getElementById('sin-resultados');
        const original = Array.prototype.slice.call(grid.children);

        function aplicar() {
            const q = buscar.value.trim().toLowerCase();
            let lista = original.filter(function (col) {
                const t = col.querySelector('.card.producto');
                const okCat = cat.value === 'todas' || t.dataset.cat === cat.value;
                const okTxt = !q || t.dataset.nombre.toLowerCase().indexOf(q) !== -1;
                return okCat && okTxt;
            });
            const val = function (col) { return col.querySelector('.card.producto'); };
            if (orden.value === 'menor') { lista.sort(function (a, b) { return val(a).dataset.precio - val(b).dataset.precio; }); }
            if (orden.value === 'mayor') { lista.sort(function (a, b) { return val(b).dataset.precio - val(a).dataset.precio; }); }
            if (orden.value === 'nombre') { lista.sort(function (a, b) { return val(a).dataset.nombre.localeCompare(val(b).dataset.nombre, 'es'); }); }
            original.forEach(function (c) { c.hidden = true; });
            lista.forEach(function (c) { c.hidden = false; grid.appendChild(c); });
            total.textContent = lista.length;
            vacio.hidden = lista.length !== 0;
        }
        [buscar, cat, orden].forEach(function (el) { el.addEventListener('input', aplicar); });
        document.getElementById('limpiar-filtros').addEventListener('click', function () {
            buscar.value = ''; cat.value = 'todas'; orden.value = 'defecto';
            original.forEach(function (c) { grid.appendChild(c); });
            aplicar();
        });
    }

    /* ---------- 5a. Página de detalle ---------- */
    function iniciarDetalle() {
        const cont = document.getElementById('detalle-producto');
        if (!cont) { return; }
        const id = new URLSearchParams(location.search).get('id') || 'p01';
        const p = Arena.carrito.buscar(id);
        if (!p) {
            cont.innerHTML = '<p class="alert alert-warning">No encontramos ese producto. <a href="catalogo.html">Volver al catálogo</a>.</p>';
            return;
        }
        document.title = p.nombre + ' | Arena Sport';
        const ant = p.anterior ? ' <span class="precio-anterior">' + Arena.carrito.dinero(p.anterior) + '</span>' : '';
        cont.innerHTML =
            '<div class="row g-4 align-items-center">' +
            '<figure class="col-md-5 mb-0"><img class="img-fluid rounded" src="' + p.imagen + '" alt="' + esc(p.nombre) + '" width="600" height="600"></figure>' +
            '<div class="col-md-7"><p class="etiqueta-cat">' + esc(p.catNombre) + '</p>' +
            '<h2>' + esc(p.nombre) + '</h2><p>' + esc(p.desc) + '</p>' +
            '<ul class="specs">' + p.specs.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' +
            '<p class="precio-grande">' + Arena.carrito.dinero(p.precio) + ant + '</p>' +
            '<button type="button" class="btn btn-acento btn-lg btn-agregar" data-id="' + p.id + '">Añadir al carrito</button></div></div>';

        const rel = document.getElementById('grid-relacionados');
        const otros = Arena.datos.productos.filter(function (x) { return x.cat === p.cat && x.id !== p.id; }).slice(0, 4);
        rel.innerHTML = otros.map(function (x) {
            return '<article class="col"><div class="card producto h-100" data-id="' + x.id + '" data-cat="' + x.cat + '" tabindex="0" role="button" aria-label="Ver detalles de ' + esc(x.nombre) + '">' +
                '<img src="' + x.imagen + '" class="card-img-top" alt="' + esc(x.nombre) + '" width="600" height="600" loading="lazy">' +
                '<div class="card-body"><h3 class="h6 card-title">' + esc(x.nombre) + '</h3><p class="precio mb-0">' + Arena.carrito.dinero(x.precio) + '</p></div></div></article>';
        }).join('');
        rel.id = 'grid-relacionados';
    }

    /* ---------- 5b. Página del carrito ---------- */
    function iniciarCarrito() {
        const cont = document.getElementById('lista-carrito');
        if (!cont) { return; }

        function pintar() {
            const ls = Arena.carrito.lineas();
            if (!ls.length) {
                cont.innerHTML = '<div class="carrito-vacio"><p class="h5">Tu carrito está vacío</p><a class="btn btn-acento" href="catalogo.html">Ir al catálogo</a></div>';
            } else {
                cont.innerHTML = ls.map(function (l) {
                    const p = l.producto;
                    return '<article class="item-carrito" data-id="' + p.id + '">' +
                        '<img src="' + p.imagen + '" alt="' + esc(p.nombre) + '" width="80" height="80">' +
                        '<div><h3><a href="producto.html?id=' + p.id + '">' + esc(p.nombre) + '</a></h3>' +
                        '<p class="mb-1">' + Arena.carrito.dinero(p.precio) + ' c/u</p>' +
                        '<button type="button" class="btn btn-link btn-sm p-0" data-accion="quitar">Quitar</button></div>' +
                        '<div class="cantidad"><button type="button" data-accion="menos" aria-label="Disminuir cantidad">&minus;</button>' +
                        '<output aria-live="polite">' + l.cantidad + '</output>' +
                        '<button type="button" data-accion="mas" aria-label="Aumentar cantidad">+</button>' +
                        '<strong class="ms-2">' + Arena.carrito.dinero(p.precio * l.cantidad) + '</strong></div></article>';
                }).join('');
            }
            const t = Arena.carrito.totales();
            document.getElementById('res-subtotal').textContent = Arena.carrito.dinero(t.subtotal);
            document.getElementById('res-impuesto').textContent = Arena.carrito.dinero(t.impuesto);
            document.getElementById('res-envio').textContent = t.envio ? Arena.carrito.dinero(t.envio) : 'Gratis';
            document.getElementById('res-total').textContent = Arena.carrito.dinero(t.total);
            const aviso = document.getElementById('aviso-envio');
            aviso.textContent = !ls.length ? '' : (t.faltaEnvioGratis > 0 ? 'Te faltan ' + Arena.carrito.dinero(t.faltaEnvioGratis) + ' para envío gratis.' : '¡Tu pedido tiene envío gratis!');
            document.getElementById('btn-finalizar').disabled = !ls.length;
            document.getElementById('btn-vaciar').disabled = !ls.length;
        }

        cont.addEventListener('click', function (e) {
            const b = e.target.closest('[data-accion]');
            if (!b) { return; }
            const id = b.closest('.item-carrito').dataset.id;
            const actual = Arena.carrito.leer()[id] || 0;
            if (b.dataset.accion === 'mas') { Arena.carrito.cambiarCantidad(id, actual + 1); }
            if (b.dataset.accion === 'menos') { Arena.carrito.cambiarCantidad(id, actual - 1); }
            if (b.dataset.accion === 'quitar') { Arena.carrito.quitar(id); }
        });
        document.getElementById('btn-vaciar').addEventListener('click', function () { Arena.carrito.vaciar(); });
        document.getElementById('btn-finalizar').addEventListener('click', function () {
            Arena.carrito.vaciar();
            if (Arena.avisar) { Arena.avisar('¡Gracias por tu compra! (simulación académica, no se cobró nada).'); }
        });
        document.addEventListener('carrito:cambio', pintar);
        pintar();
    }

    Arena.productos = { iniciar: function () {
        iniciarResaltado(); iniciarClics(); iniciarFiltros(); iniciarDetalle(); iniciarCarrito();
    } };
})();
