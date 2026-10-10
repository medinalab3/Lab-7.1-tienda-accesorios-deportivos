/* ============================================================
   formulario.js — validación de formularios en tiempo real
   Cada campo declara sus reglas en el atributo data-reglas, por
   ejemplo: data-reglas="requerido|min:3|email".
   Los formularios con la clase "validar" se validan:
     - mientras se escribe (evento input),
     - al salir del campo (evento blur),
     - y de nuevo al enviar (evento submit).
   El resultado se muestra con las clases is-valid / is-invalid de
   Bootstrap y con mensajes que indican exactamente qué corregir.
   ============================================================ */
(function () {
    'use strict';

    window.Arena = window.Arena || {};

    // Cada regla devuelve un mensaje de error, o '' si el valor es válido.
    const REGLAS = {
        requerido: function (v, campo) {
            if (campo.type === 'checkbox') { return campo.checked ? '' : 'Este campo es obligatorio.'; }
            return v.trim() === '' ? 'Este campo es obligatorio.' : '';
        },
        marcado: function (v, campo) { return campo.checked ? '' : 'Debes aceptar para continuar.'; },
        min: function (v, campo, n) {
            return v.trim() !== '' && v.trim().length < Number(n) ? 'Escribe al menos ' + n + ' caracteres (llevas ' + v.trim().length + ').' : '';
        },
        max: function (v, campo, n) {
            return v.length > Number(n) ? 'Máximo ' + n + ' caracteres.' : '';
        },
        email: function (v) {
            if (v.trim() === '') { return ''; }
            return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Escribe un correo válido, por ejemplo nombre@dominio.com.';
        },
        telefono: function (v) {
            if (v.trim() === '') { return ''; }   // es opcional
            const digitos = v.replace(/\D/g, '');
            return /^[\d\s()+-]+$/.test(v) && digitos.length >= 10 && digitos.length <= 11
                ? '' : 'Usa un teléfono de 10 dígitos, por ejemplo 787-555-0142.';
        }
    };

    function validarCampo(campo) {
        const reglas = (campo.dataset.reglas || '').split('|').filter(Boolean);
        let mensaje = '';
        for (let i = 0; i < reglas.length && !mensaje; i++) {
            const partes = reglas[i].split(':');
            const fn = REGLAS[partes[0]];
            if (fn) { mensaje = fn(campo.value, campo, partes[1]); }
        }
        const opcionalVacio = campo.value.trim() === '' && reglas.indexOf('requerido') === -1 && campo.type !== 'checkbox';

        const cont = campo.closest('.mb-3, .input-group, .form-check') || campo.parentElement;
        const fb = cont.querySelector('.invalid-feedback');
        if (fb) { fb.textContent = mensaje; }

        campo.classList.remove('is-valid', 'is-invalid');
        if (mensaje) {
            campo.classList.add('is-invalid');
        } else if (!opcionalVacio) {
            campo.classList.add('is-valid');
        }
        campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
        return mensaje === '';
    }

    function iniciarFormulario(form) {
        const campos = Array.prototype.slice.call(form.querySelectorAll('[data-reglas]'));

        campos.forEach(function (campo) {
            // Contador de caracteres en vivo (ej. el mensaje de contacto)
            const idContador = campo.dataset.contador;
            const contador = idContador ? document.getElementById(idContador) : null;

            function alCambiar() {
                if (contador) {
                    contador.textContent = campo.value.length;
                    contador.classList.toggle('contador-alerta', campo.value.length > 500);
                }
                validarCampo(campo);
            }
            campo.addEventListener('input', alCambiar);
            campo.addEventListener('change', alCambiar);
            campo.addEventListener('blur', function () { validarCampo(campo); });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();                          // no recargo la página
            const resultados = campos.map(validarCampo); // valido TODOS (sin cortocircuito)
            const primerError = campos.find(function (c) { return c.classList.contains('is-invalid'); });
            if (resultados.every(Boolean)) {
                if (Arena.avisar) {
                    Arena.avisar(form.id === 'form-boletin' ? '¡Listo! Te suscribiste al boletín.' : '¡Mensaje enviado! Te responderemos pronto. (simulación)');
                }
                form.reset();
                campos.forEach(function (c) {
                    c.classList.remove('is-valid', 'is-invalid');
                    c.removeAttribute('aria-invalid');
                    const idC = c.dataset.contador;
                    if (idC) { document.getElementById(idC).textContent = '0'; }
                });
            } else if (primerError) {
                primerError.focus();                     // llevo al usuario al primer error
            }
        });
    }

    Arena.formulario = {
        iniciar: function () {
            document.querySelectorAll('form.validar').forEach(iniciarFormulario);
        },
        validarCampo: validarCampo
    };
})();
