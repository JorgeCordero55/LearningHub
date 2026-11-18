---
name: animated-line-art
description: "Guía para hacer dibujos de líneas animados para páginas web (tarjetas, mosaicos, banners, secciones) con SVG en línea y CSS: cómo elegir la idea, componerla para que sea la imagen principal, animarla (luz que corre por líneas, partes que se encienden en orden, agujas, flujos) y dejarla accesible, de una vez y sin gastar de más. Trae una plantilla lista para copiar, ideas por tipo de servicio y las técnicas con código. Úsala siempre que alguien quiera dibujos o ilustraciones animadas en un sitio web, tarjetas animadas, 'que se mueva', animación SVG o CSS, íconos con movimiento, o arreglar animaciones que se ven apretadas o genéricas, se salen de su caja o tapan el texto, aunque nunca diga SVG."
compatibility: "La mirada final usa scripts/shoot.mjs, que necesita Node.js 22+ y Microsoft Edge o Google Chrome; sin ellos, abre la página y mírala."
---

# Dibujos de líneas animados

Dibujos de líneas animados que son la imagen principal de un elemento de la
página: una torre con sus cables energizados, un chip conectado a pistas de
circuito, un medidor cuya aguja mantiene el equilibrio, edificios que se
encienden piso por piso. SVG en línea dibujado con código y animado con CSS;
sin bibliotecas, imágenes ni video.

La idea de esta guía es hacerlo bien a la primera: partir de una estructura
probada (`assets/plantilla.html`), aplicar las reglas mientras construyes y
echar una sola mirada al final. El tiempo y los tokens van al dibujo, no a
rondas de revisión.

## Qué hace bueno un dibujo

- **Es la imagen principal de la tarjeta.** Usa la tarjeta: su altura, su
  lado derecho, su parte de arriba, y se sale por los bordes donde ayuda. Una
  franja de líneas encima del título se lee como un adorno.
- **Una idea, fiel al tema.** Lo que la cosa es o hace de verdad, tomado del
  texto del propio sitio. Nunca inventes datos ni cifras.
- **Las vecinas se distinguen.** En una fila, cada dibujo tiene otra idea y
  otra forma: una torre, un chip, un medidor, edificios.
- **Cuenta una historia corta y descansa.** Algo llega (luz, agua, datos),
  algo responde (se enciende, se llena, cae en su sitio), todo se calma y el
  ciclo vuelve a empezar sin saltos. Tranquilo y continuo.
- **El texto siempre gana.** Nunca queda tapado, en ningún ancho.
- **Bordes limpios y formas sólidas.** Nada se sale de la tarjeta; lo que va
  delante tiene el cuerpo relleno.

## Cómo hacerlo

1. **Entiende la tarjeta.** Lee solo lo necesario: qué servicio es, su texto,
   su tamaño y dónde queda el texto (casi siempre abajo a la izquierda).
2. **Elige una idea.** Pregúntate qué es o qué hace físicamente el servicio y
   arma una escena con un protagonista y un flujo que llega y provoca una
   respuesta (ver "Ideas que funcionan"). Elige una y sigue. Solo si la persona
   pidió opciones, descríbele dos o tres en una frase cada una y deja que
   elija.
3. **Compón desde la plantilla.** Copia la estructura de
   `assets/plantilla.html`: dos SVG (el dibujo quieto y las partes que se
   mueven), una caja de 300 x 280 anclada a un lado con
   `preserveAspectRatio` (`xMaxYMax` si el dibujo se para en el suelo,
   `xMaxYMin` si cuelga de arriba, `xMaxYMid` si va centrado), recortada en la
   tarjeta. Pon el protagonista en la columna derecha, de arriba abajo, y deja
   que lo que viaja entre o salga por los bordes. Limita el ancho del texto
   (`max-width`) para que no llegue al protagonista.
4. **Anímalo.** Un solo ciclo para toda la tarjeta (5 a 7 s), con dos o tres
   tipos de movimiento como mucho, y retardos que sigan la historia: lo que
   responde empieza cuando le llega lo que viaja. El código de cada movimiento
   está en `references/techniques.md`.
5. **Una mirada al final.** Dos capturas con la animación congelada a mitad
   del ciclo, una de escritorio y una de teléfono:

   ```bash
   node scripts/shoot.mjs --url <página> --out escritorio.png --width 1440 --selector ".tile" --time 2000
   node scripts/shoot.mjs --url <página> --out telefono.png --width 390 --selector ".tile" --time 2000
   ```

   Busca texto tapado, algo que se sale, un borde apretado o una forma que se
   transparenta. Arregla lo que veas y termina; no abras más rondas. Si no
   puedes correr el script, abre la página y mírala.

## Reglas al construir

Cada una evita un error que ya pasó. Aplícalas mientras escribes; así no
hace falta buscarlos después.

- **Recorta en la tarjeta** (`clip-path: inset(0 round <radio>)` en el SVG):
  nada sale de ella, ni líneas ni su luz.
- **Deja aire en los bordes:** el protagonista queda a 12 px o más del borde
  (lo que mide la esquina redondeada), o se corta limpio en él.
- **Rellena lo que va delante** con el color de la tarjeta; solo contornos
  dejan ver lo de atrás. Las luces que quedan detrás de algo se dibujan antes
  que eso.
- **Si la luz llena algo, que llegue a todo:** cada piso, cada núcleo.
- **Movimiento reducido al final:** el bloque
  `@media (prefers-reduced-motion: reduce)` va después de las reglas que
  animan (si va antes, pierde) y nombra cada clase animada. Que el estado
  quieto se vea terminado: luces apagadas o la escena completa.
- **Sin filtros en lo que se mueve:** los brillos son una copia más ancha y
  translúcida del trazo.
- **Si una parte debe quedar arriba y otra en el suelo,** usa dos cajas, una
  anclada arriba y otra abajo, con la misma escala: si la tarjeta crece, una
  sola caja anclada abajo sube hasta el título.
- **Las reglas genéricas atrapan decoraciones:** una regla como
  `.tile > :not(svg) { position: relative }` también cambia cualquier span
  decorativo que añadas.
- **Bucles de más de 5 segundos:** la pauta WCAG 2.2.2 pide una forma de
  pausarlos (el botón del sitio para detener animaciones, uno propio, o que se
  detengan tras unos ciclos). Si el sitio no tiene ninguna, dilo.

## Ideas que funcionan

| Servicio | Protagonista | Lo que viaja | Lo que responde |
|---|---|---|---|
| Electricidad, transmisión | Torre con sus cables | Pulsos por los cables | Una subestación o una casa que se enciende |
| Fibra, datos, telecomunicaciones | Chip con pistas, o torre con antenas | Pulsos por las pistas o el enlace | Núcleos del chip o ventanas que se encienden |
| Control, monitoreo | Medidor o pantalla | La aguja que corrige, la onda que se escribe | La aguja vuelve a su marca |
| Clientes, edificios | Uno o varios edificios | Un cable que llega | Los pisos se encienden de arriba abajo |
| Agua | Tanque, torre de agua, tuberías | El agua por la tubería | El grifo gotea, la casa la recibe |
| Reciclaje, logística | Cinta transportadora | Objetos que avanzan | Caen en su contenedor, que se ilumina |
| Energía solar | Paneles bajo el sol | Energía por el cable | Las casas del barrio se encienden |
| Laboratorio, calidad | Matraz, tubos, monitor | Una gota, una lectura | La lectura cae dentro de los límites, una marca de aprobado |

## Archivos

- `assets/plantilla.html`: un ejemplo completo para copiar (estructura,
  capas, recorte, tiempos, movimiento reducido). Cambia el dibujo por tu idea.
- `references/techniques.md`: cada pieza con código (luz por una línea,
  encender partes, agujas, haces de pistas, curvas paralelas, acelerar al
  pasar el puntero, pausar fuera de pantalla).
- `references/generator.md`: solo para dibujos con muchas piezas calculadas
  (decenas de ventanas, pistas paralelas, retardos desde largos): generarlas
  con un script y probar que la página coincide.
- `scripts/shoot.mjs`: la mirada final (capturas en un navegador sin
  interfaz, con la animación congelada en un momento). `--help` lista sus
  opciones.
