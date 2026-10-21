/* ================================================================
   MAREMARES ENGLISH GUIDE — main.js
   Lógica de animaciones con IntersectionObserver

   📌 NOTA PARA EL APRENDIZ:
   Este archivo usa JavaScript "puro" (Vanilla JS), sin frameworks.
   Te explicaré cada paso como si lo vieras por primera vez.
   ================================================================ */


/* ----------------------------------------------------------------
   ¿QUÉ ES UN IntersectionObserver?

   Imagina que tienes una "cámara" invisible apuntando a tu pantalla.
   El IntersectionObserver es esa cámara: vigila ciertos elementos del
   HTML y "dispara" una función automáticamente cuando el usuario
   hace scroll y esos elementos entran o salen del área visible.

   Esto nos permite crear la animación "aparece al hacer scroll" sin
   necesidad de escuchar el evento scroll manualmente (que es más lento
   y consume más batería en el teléfono).
   ---------------------------------------------------------------- */


/* ================================================================
   PARTE 1: ESPERAR A QUE EL HTML ESTÉ COMPLETAMENTE CARGADO
   ================================================================ */

/* 
   'DOMContentLoaded' es un evento que el navegador dispara cuando
   terminó de leer y construir todo el HTML de la página.
   
   Envolvemos TODO nuestro código dentro de este listener porque:
   → Si ejecutamos JS antes de que el HTML esté listo,
     intentaremos "buscar" elementos que todavía no existen.
   → Resultado: errores silenciosos o animaciones que nunca funcionan.
*/
document.addEventListener('DOMContentLoaded', function () {

    /* Punto de entrada: llamamos a cada función que configura
       las distintas partes de la interactividad. */
    setupScrollAnimations();

});


/* ================================================================
   PARTE 2: CONFIGURAR LAS ANIMACIONES DE SCROLL
   ================================================================ */

function setupScrollAnimations() {

    /*
       ── PASO 1: SELECCIONAR LOS ELEMENTOS A ANIMAR ──

       'document.querySelectorAll' busca en todo el HTML TODOS los
       elementos que coincidan con el selector CSS entre comillas.
       
       Devuelve un "NodeList": algo parecido a un array (lista) con
       todos los elementos encontrados.
       
       En nuestro caso, busca todos los elementos que tienen
       la clase CSS '.reveal-element' (que definimos en el CSS
       con opacity:0 y translateY(28px), es decir, invisibles).
       
       Elementos que tienen esa clase en nuestro HTML:
         - El título "MÓDULOS POR ÁREA DE TRABAJO" (dentro de .modules-header)
         - Las 4 tarjetas (.module-card)
    */
    const elementosAAnimar = document.querySelectorAll('.reveal-element');

    /*
       Si por alguna razón no hay elementos con esa clase en el HTML,
       salimos de la función para evitar errores.
       'return' detiene la ejecución de la función inmediatamente.
    */
    if (elementosAAnimar.length === 0) return;


    /*
       ── PASO 2: DEFINIR LAS OPCIONES DEL OBSERVER ──

       Antes de crear el observer, le decimos cómo debe comportarse
       mediante un objeto de "opciones" (objeto = { clave: valor }).
    */
    const opcionesObserver = {

        /*
           'root': null
           Significa "usa el viewport del navegador (la pantalla visible)
           como área de referencia". Si pusieramos un elemento específico,
           vigilaría la intersección dentro de ese elemento.
        */
        root: null,

        /*
           'rootMargin': '-80px 0px -40px 0px'
           Es como un margen que añadimos al área de referencia.
           Formato: arriba / derecha / abajo / izquierda (igual que CSS margin).
           
           '-80px' arriba: el elemento debe entrar 80px dentro del viewport
           para ser considerado "visible". Esto hace que la animación
           dispare un poco ANTES de que el elemento llegue totalmente al centro,
           dando un efecto más fluido.
           
           '-40px' abajo: el elemento se considera "fuera" cuando le faltan
           40px para salir por abajo (no queremos re-animar si el usuario
           sube el scroll de vuelta).
        */
        rootMargin: '-80px 0px -40px 0px',

        /*
           'threshold': 0
           Porcentaje del elemento que debe ser visible para disparar el callback.
           0 = dispara en cuanto cualquier píxel del elemento sea visible.
           1 = dispara solo cuando el elemento está completamente visible.
           0.25 = dispara cuando el 25% del elemento es visible.
        */
        threshold: 0,
    };


    /*
       ── PASO 3: CREAR EL IntersectionObserver ──

       new IntersectionObserver(callback, opciones) crea el observador.
       
       'callback' es la función que se ejecutará CADA VEZ que un elemento
       observado entre o salga del viewport.
       
       Esta función recibe automáticamente un parámetro 'entradas':
       un array con información de todos los elementos que cambiaron
       de estado en ese "tick" de observación.
    */
    const observer = new IntersectionObserver(function (entradas) {

        /*
           Iteramos (recorremos) cada entrada del array.
           'entrada' representa un elemento que el observer está vigilando
           y que acaba de "cambiar de estado" (entró o salió del viewport).
        */
        entradas.forEach(function (entrada, indice) {

            /*
               'entrada.isIntersecting' es un booleano (true/false).
               → true:  el elemento ENTRÓ en el área visible del viewport.
               → false: el elemento SALIÓ del área visible.
               
               Solo actuamos cuando el elemento es visible (true).
            */
            if (entrada.isIntersecting) {

                /*
                   'entrada.target' es el elemento HTML real del DOM que
                   acaba de volverse visible.
                   
                   Aquí usamos 'setTimeout' para crear la animación ESCALONADA.
                   
                   setTimeout(función, milisegundos): espera X milisegundos
                   antes de ejecutar la función.
                   
                   El truco: multiplicamos el índice por 120 milisegundos.
                   → Elemento 0 (título):  espera 0ms   → aparece inmediatamente
                   → Tarjeta 1:            espera 120ms → aparece 0.12s después
                   → Tarjeta 2:            espera 240ms → aparece 0.24s después
                   → Tarjeta 3:            espera 360ms → aparece 0.36s después
                   → Tarjeta 4:            espera 480ms → aparece 0.48s después
                   
                   Resultado: las tarjetas "caen" en cascada, una tras otra.
                */
                setTimeout(function () {

                    /*
                       Añadimos la clase 'is-visible' al elemento.
                       Recuerda: en el CSS definimos:
                         .reveal-element.is-visible { opacity: 1; transform: translateY(0) }
                       
                       Al añadir esta clase, el CSS transiciona el elemento
                       de invisible (opacity: 0) a visible (opacity: 1)
                       y de desplazado (translateY(28px)) a su posición normal.
                    */
                    entrada.target.classList.add('is-visible');

                    /*
                       Una vez que el elemento ya es visible y fue animado,
                       dejamos de observarlo. No tiene sentido seguir vigilando
                       algo que ya hizo lo que tenía que hacer.
                       
                       Esto también mejora el rendimiento: el observer tiene
                       menos elementos que monitorizar.
                    */
                    observer.unobserve(entrada.target);

                }, indice * 120); /* ← 120ms de delay entre cada elemento */

            } /* fin del if (entrada.isIntersecting) */

        }); /* fin del forEach */

    }, opcionesObserver); /* ← Le pasamos las opciones al crear el observer */


    /*
       ── PASO 4: DECIRLE AL OBSERVER QUÉ ELEMENTOS VIGILAR ──

       Tenemos el observer creado, pero todavía no sabe QUÉ vigilar.
       Debemos "registrar" cada elemento con observer.observe(elemento).
       
       Usamos forEach para hacerlo sobre todos los elementos de nuestra
       lista 'elementosAAnimar' que seleccionamos en el PASO 1.
    */
    elementosAAnimar.forEach(function (elemento) {
        /*
           'observer.observe(elemento)' le dice al IntersectionObserver:
           "Empieza a vigilar este elemento. Cuando entre o salga del
           viewport, dispara el callback."
        */
        observer.observe(elemento);
    });

    /* 
       ¡Y eso es todo! El observer ya está activo y en segundo plano.
       No necesitamos hacer nada más: el navegador se encarga
       de llamar a nuestro callback automáticamente.
    */

} /* fin de setupScrollAnimations() */
