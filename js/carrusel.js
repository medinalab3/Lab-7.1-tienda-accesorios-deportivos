/* ============================================================
   carrusel.js — carrusel de imágenes hecho con JavaScript
   Funciones: avance automático, flechas, puntos, pausa al pasar el
   mouse o enfocar, teclado (← →), deslizar en pantallas táctiles y
   respeto a prefers-reduced-motion.
   ============================================================ */
(function () {
    'use strict';

    window.Arena = window.Arena || {};

    function iniciar() {
        const raiz = document.getElementById('carrusel');
        if (!raiz) { return; }

        const slides = Array.prototype.slice.call(raiz.querySelectorAll('.slide'));
        const puntosCont = raiz.querySelector('.carrusel-puntos');
        const btnPausa = raiz.querySelector('.carrusel-pausa');
        const INTERVALO = 5000;           // milisegundos entre diapositivas
        let actual = 0;
        let temporizador = null;
        let pausadoPorUsuario = false;
        const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Creo un punto por cada diapositiva
        const puntos = slides.map(function (s, i) {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('role', 'tab');
            b.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
            b.addEventListener('click', function () { ir(i); reiniciar(); });
            puntosCont.appendChild(b);
            return b;
        });

        function ir(n) {
            actual = (n + slides.length) % slides.length;   // da la vuelta al llegar al final
            slides.forEach(function (s, i) {
                const activa = i === actual;
                s.classList.toggle('activo', activa);
                s.setAttribute('aria-hidden', activa ? 'false' : 'true');
                // Los enlaces de diapositivas ocultas no deben recibir foco
                s.querySelectorAll('a').forEach(function (a) { a.tabIndex = activa ? 0 : -1; });
            });
            puntos.forEach(function (p, i) { p.setAttribute('aria-selected', i === actual ? 'true' : 'false'); });
        }
        function siguiente() { ir(actual + 1); }
        function anterior() { ir(actual - 1); }

        function arrancar() {
            if (reducido || pausadoPorUsuario || temporizador) { return; }
            temporizador = setInterval(siguiente, INTERVALO);
        }
        function detener() { clearInterval(temporizador); temporizador = null; }
        function reiniciar() { detener(); arrancar(); }

        raiz.querySelector('.siguiente').addEventListener('click', function () { siguiente(); reiniciar(); });
        raiz.querySelector('.anterior').addEventListener('click', function () { anterior(); reiniciar(); });

        // Pausa al pasar el mouse o al enfocar con teclado
        raiz.addEventListener('mouseenter', detener);
        raiz.addEventListener('mouseleave', arrancar);
        raiz.addEventListener('focusin', detener);
        raiz.addEventListener('focusout', arrancar);

        btnPausa.addEventListener('click', function () {
            pausadoPorUsuario = !pausadoPorUsuario;
            btnPausa.innerHTML = pausadoPorUsuario ? '&#9654;' : '&#10074;&#10074;';
            btnPausa.setAttribute('aria-label', pausadoPorUsuario ? 'Reanudar carrusel' : 'Pausar carrusel');
            pausadoPorUsuario ? detener() : arrancar();
        });

        // Teclado
        raiz.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { siguiente(); reiniciar(); }
            if (e.key === 'ArrowLeft') { anterior(); reiniciar(); }
        });

        // Deslizar con el dedo
        let inicioX = null;
        raiz.addEventListener('touchstart', function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
        raiz.addEventListener('touchend', function (e) {
            if (inicioX === null) { return; }
            const dx = e.changedTouches[0].clientX - inicioX;
            if (Math.abs(dx) > 40) { dx < 0 ? siguiente() : anterior(); reiniciar(); }
            inicioX = null;
        });

        // Si la pestaña no está visible, no gasto recursos
        document.addEventListener('visibilitychange', function () { document.hidden ? detener() : arrancar(); });

        ir(0);
        arrancar();
    }

    Arena.carrusel = { iniciar: iniciar };
})();
