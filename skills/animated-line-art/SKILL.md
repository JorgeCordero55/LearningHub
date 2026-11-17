---
name: animated-line-art
description: "Diseña y construye dibujos de líneas animados para páginas web (tarjetas, mosaicos, botones, portadas, secciones) como SVG en línea animado con CSS: luz que corre por líneas y pistas de circuito, partes que se encienden en secuencia, medidores y agujas, edificios y máquinas dibujados en líneas. Cubre el proceso que da buenos resultados: conceptos y una vista previa primero, un dibujo distinto por tarjeta que ocupa toda la tarjeta, texto siempre legible, movimiento reducido, y revisar cada cambio en un navegador real sin interfaz (capturas en muchos anchos, cuadros congelados en momentos exactos, bordes ampliados, texto medido contra el dibujo). Úsala siempre que alguien quiera dibujos o ilustraciones animadas en un sitio web, tarjetas animadas, 'que se mueva', animación SVG o CSS, íconos con movimiento, o pida arreglar animaciones que se ven apretadas o genéricas, se salen de su caja, tapan el texto o parpadean, aunque nunca diga SVG."
compatibility: "scripts/shoot.mjs necesita Node.js 22+ y Microsoft Edge o Google Chrome."
---

# Dibujos de líneas animados

Dibujos de líneas animados que son la imagen principal de un elemento de la
página: una torre de transmisión con sus cables energizados, un microchip
conectado a pistas de circuito, un medidor cuya aguja mantiene el equilibrio,
edificios que se encienden piso por piso. Tecnología web corriente: SVG en
línea dibujado con código y animado con CSS. Sin bibliotecas de animación,
imágenes ni video.

Lo que separa un buen resultado de uno genérico no es tanto el código como el
proceso alrededor: decidir qué significa cada dibujo, mostrar opciones antes
de construir y mirar el resultado como lo haría una persona, en todos los
anchos y en los momentos exactos de la animación. Esta skill es ese proceso.
La persona con la que trabajas decide; tú propones, construyes y revisas.

## Cómo se ve un buen resultado

- **El dibujo es la imagen principal de la tarjeta.** Usa la tarjeta: su
  altura, su lado derecho, su parte de arriba, y se sale por los bordes donde
  conviene. Una franja fina de líneas encima del título se lee como un adorno,
  no como la identidad de la tarjeta.
- **Una idea por tarjeta, fiel a su tema.** Basa cada dibujo en lo que la cosa
  es o hace de verdad, tomado del propio contenido del sitio. Nunca inventes
  datos ni cifras para adornar un dibujo.
- **Las vecinas se distinguen.** Las tarjetas de una fila difieren en idea *y*
  en forma: una torre, un chip, un medidor, edificios. Dos tipos de ondas una
  al lado de la otra se leen como lo mismo dos veces.
- **Original, no forzado.** Cuando alguien elogia un rasgo de un dibujo
  («tiene su propia verticalidad»), casi siempre se refiere a una cualidad
  (presencia, originalidad), no a una forma para copiar en los demás. Di qué
  cualidad crees que quiere decir antes de diseñar para ella.
- **El movimiento cuenta una historia corta y descansa.** Llega la luz, algo
  se enciende en respuesta, todo se calma y el ciclo vuelve a empezar sin
  saltos. Tranquilo y continuo: los fallos y temblores parecen errores.
- **El texto siempre gana.** El texto queda libre del dibujo en todos los
  anchos. Las líneas que tienen que pasar detrás del texto se desenfocan un
  poco ahí y las partes que se mueven se ocultan ahí; el resto del dibujo
  conserva toda su fuerza.
- **Bordes limpios.** Nada se sale de la tarjeta. Los dibujos quedan lejos del
  borde al menos lo que mide su esquina redondeada, o se cortan limpio en él.
- **Sólido donde debe ser sólido.** Una forma delante de otra tiene el cuerpo
  relleno; solo con contornos, se transparenta lo que hay detrás.
- **Accesible y liviano.** Toda animación se detiene con
  `prefers-reduced-motion` y con el botón del sitio para detener animaciones,
  si lo tiene; las animaciones se pausan fuera de pantalla; nada que se mueva
  usa filtros SVG.

## Flujo de trabajo

### 1. Lee antes de dibujar

- **La página:** los elementos a ilustrar, su texto y su orden, la
  distribución en cada punto de quiebre (lado a lado, de dos en dos, apilados)
  y cuánto los alarga el texto.
- **El tema:** el contenido propio del sitio y sus fuentes sobre de qué trata
  cada elemento. Anota los datos que los dibujos pueden mostrar.
- **El estilo de la casa:** colores y variables, motivos que ya existen (un
  sitio que ya dibuja pistas de circuito o una cuadrícula merece dibujos en
  ese idioma), el código de animación que ya hay (efectos al pasar el puntero,
  pausa fuera de pantalla, movimiento reducido, cualquier script que reescriba
  SVG).
- **Las reglas:** archivos de instrucciones o de lecciones del proyecto, cómo
  llegan los cambios a producción, si el servidor de desarrollo recarga las
  plantillas solo.

### 2. Conceptos, luego una vista previa

Escribe dos o tres conceptos por elemento: la idea (qué muestra y por qué es
fiel al tema), la forma (dónde va en la tarjeta y en qué se distingue de sus
vecinas) y la historia del movimiento. Después construye una **vista previa**
en vez de tocar el sitio:

- un archivo HTML independiente que carga la hoja de estilos real del sitio y
  copia el marcado real de las tarjetas, para que fuentes, tamaños y colores
  sean los verdaderos;
- primero las tarjetas actuales, para comparar; luego una fila por opción, con
  las tarjetas nuevas resaltadas con un contorno; además una fila al ancho de
  una tableta y otra al de un teléfono;
- servida por http, no abierta como archivo (algunos navegadores y equipos
  administrados nunca muestran páginas `file://`):
  `python -m http.server 8766 --bind 127.0.0.1 --directory <carpeta>`;
- abierta en una **ventana nueva del navegador** en la pantalla de la persona,
  comprobando que la ventana se abrió de verdad (su título en la lista de
  procesos). Dile la dirección y que el sitio en sí no ha cambiado.

Deja que elija. Cuenta con varias rondas: en cada una, cambia lo que nombró y
conserva lo que le gustó. Pregunta antes de reemplazar algo que ya aprobó.

**Si nadie puede elegir** (trabajas solo, en una tarea programada o en una
prueba), no armes la vista previa: compara los conceptos rápido, como mucho
con un boceto o una captura de cada uno, elige uno, anota por qué y
construye solo ese. Una vista previa completa sin nadie que la mire gasta
tiempo y tokens sin decidir nada.

### 3. Constrúyelo en el sitio

Sigue `references/techniques.md`. En resumen:

- Dibuja cada ilustración en una caja fija (`viewBox="0 0 300 280"`) anclada a
  un lado de la tarjeta con `preserveAspectRatio="xMaxYMin meet"` (o `YMid`,
  `YMax`), para que conserve su composición en cualquier tamaño de tarjeta.
  Deja que las líneas se salgan de la caja (`overflow="visible"`) y recorta en
  la tarjeta.
- Dos capas SVG por tarjeta: el dibujo quieto, y las partes que se mueven en
  su propia capa de composición.
- Un solo ciclo de animación por tarjeta; el retardo de cada parte se calcula
  a partir de la geometría (cuándo le llega la luz).
- Reserva espacio para el dibujo (un espaciador encima del texto, un
  `max-width` en el texto) en vez de dejar que se encimen.
- Cuando la geometría o los tiempos pasan de unos pocos números, genéralos
  con un script pequeño y prueba que los archivos coincidan con él
  (`references/generator.md`).

### 4. Míralo en un navegador real

Nunca juzgues un dibujo por su código. `scripts/shoot.mjs` maneja Edge o
Chrome sin interfaz (Node 22+, sin nada que instalar):

```bash
# la fila de tarjetas a 1440 de ancho, con todas las animaciones congeladas en 2,4 s
node scripts/shoot.mjs --url http://127.0.0.1:8000/ --out fila.png --width 1440 --selector ".tiles" --time 2400
# una tarjeta, cuatro veces más grande
node scripts/shoot.mjs --url http://127.0.0.1:8000/ --out tarjeta.png --selector ".tile:nth-child(4)" --scale 4
# el estado quieto
node scripts/shoot.mjs --url http://127.0.0.1:8000/ --out quieto.png --selector ".tiles" --reduced-motion
# dónde termina el texto en cada tarjeta, y si toca partes marcadas con data-keep-clear
node scripts/shoot.mjs --url http://127.0.0.1:8000/ --no-shot --eval scripts/text-boxes.js --arg "tiles=.tile" --arg "keep-clear=[data-keep-clear]"
```

`node scripts/shoot.mjs --help` muestra todas las opciones (`--full`, `--pad`,
`--header` para sitios que cuentan visitas, `--wait`).

Mira cada imagen que tomes. Revisa por lo menos:

- **anchos:** un teléfono (390), una tableta (de 800 a 1200), **el ancho más
  angosto en que las tarjetas siguen lado a lado** (a menudo de 1281 a 1366:
  ahí el texto se parte más y las tarjetas crecen más), 1440 y 1920;
- **la fila completa** (equilibrio, nada repetido) y luego **cada tarjeta
  ampliada** dos a cuatro veces: bordes, esquinas, partes encimadas;
- **cuadros congelados en los momentos que importan:** antes de que llegue la
  luz, cuando llega, todo encendido, en reposo;
- **movimiento reducido y el botón para detener animaciones:** el estado
  quieto debe verse terminado, no roto;
- **el texto frente al dibujo,** medido, en todos los anchos.

### 5. Entrega

Corre las pruebas del proyecto y añade pruebas para lo que podría romperse sin
avisar: que los archivos dejen de coincidir con el generador, o que una
animación ya no se detenga con movimiento reducido. Haz commit como lo pida el
proyecto. Dile a la persona qué cambió, qué revisaste y en qué anchos, qué no
pudiste revisar, y ábrele la página local para que la vea.

## Lista de comprobación

Casi todos los puntos de esta lista ya salieron mal alguna vez. Antes de
mostrar algo:

1. ¿Cada dibujo usa su tarjeta, o es una franja encima del título?
2. ¿Los dibujos vecinos se distinguen en idea y en forma?
3. ¿Algún texto toca un dibujo en algún ancho, sobre todo en la distribución
   más angosta con tarjetas lado a lado?
4. ¿Un dibujo anclado se mete en el texto cuando la tarjeta crece? Las partes
   ancladas abajo suben con la altura de la tarjeta. Divide ese dibujo en una
   caja anclada arriba y otra abajo, con la misma escala.
5. ¿Algo se sale de la tarjeta, como líneas o su luz derramándose en el
   espacio entre tarjetas?
6. ¿El dibujo queda lejos del borde y de sus esquinas redondeadas?
7. ¿Se transparenta una forma que debería ser sólida? ¿Las luces que tiene
   detrás se ven a través de ella?
8. Cuando algo se llena de luz, ¿la luz llega a todo (cada piso, cada núcleo)?
9. ¿Las partes se encienden en el orden y en el momento correctos? Congela
   cuadros para comprobarlo.
10. ¿Toda animación se detiene con movimiento reducido y con el botón del
    sitio? Las reglas de movimiento reducido deben ir *después* de las reglas
    que inician las animaciones: con la misma especificidad, gana la regla
    posterior.
11. ¿Hay marcas sueltas? Encuentra qué dibuja una ocultando capas de una en
    una. Una regla genérica para los hijos de la tarjeta
    (`.tile > :not(svg) { position: relative }`) puede atrapar un elemento
    decorativo y encogerlo hasta volverlo una chispa.
12. ¿Las capturas usaron las fuentes correctas? Un encabezado añadido a todas
    las solicitudes hace fallar las de fuentes de otro origen (se rechaza la
    verificación previa de CORS) y el texto cae en otra fuente, con otros
    anchos. `shoot.mjs` añade `--header` solo al origen del propio sitio.
13. Si el sitio cuenta visitas, ¿tus revisiones automáticas se identifican con
    un encabezado que las estadísticas excluyen?
14. ¿La persona vio de verdad la vista previa: servida por http, abierta en
    una ventana nueva, con el título de la ventana comprobado?
15. ¿El servidor de desarrollo tomó los cambios? Reinícialo si no recarga las
    plantillas solo.
16. ¿Algo se mueve en bucle más de 5 segundos? La pauta de accesibilidad WCAG
    2.2.2 pide una forma de pausarlo: el botón del sitio para detener
    animaciones, un botón de pausa propio, o que se detenga tras unos ciclos.
    Si el sitio no tiene ninguna, dilo y ofrece una.

## Cuando llegan comentarios

- **Capturas y recortes:** encuentra el punto exacto ampliando tú la misma
  zona. Cuando un comentario se pueda leer de dos maneras, di en una línea
  cómo lo entendiste.
- **«Muy apretado», «muy simple», «más recorrido»:** cambia esa sola cosa,
  conserva lo demás y muestra el punto antes y después.
- **Cosas que notas por el camino:** arregla las que están rotas y dilo;
  pregunta antes de añadir comportamiento visible que nadie pidió.
- **Lecciones:** si el proyecto tiene un archivo de lecciones, convierte cada
  corrección en una regla allí.

## Archivos

- `scripts/shoot.mjs`: capturas, cuadros congelados, ampliación, movimiento
  reducido, mediciones dentro de la página.
- `scripts/text-boxes.js`: dónde está el texto en cada tarjeta y qué toca
  (para `shoot.mjs --eval`).
- `references/techniques.md`: las piezas, con código. Léelo antes de
  construir.
- `references/generator.md`: generar la geometría y los tiempos con un
  script, y probar que la página coincide.
