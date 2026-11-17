# Técnicas

Las piezas, con código. Las coordenadas son unidades de usuario SVG en una
caja de 300 x 280, salvo que se diga otra cosa; los colores son ejemplos
(líneas blancas sobre el azul de la tarjeta).

## Contenido

1. Estructura de la tarjeta: caja, anclaje, capas
2. Luz que corre por una línea
3. Un solo ciclo, retardos calculados
4. Encender partes
5. Rotación: agujas y diales
6. Brillos sin filtros
7. Haces de pistas paralelas
8. Curvas paralelas
9. Formas sólidas y orden de dibujo
10. Texto y dibujo lado a lado
11. Acelerar al pasar el puntero
12. Pausar fuera de pantalla
13. Movimiento reducido y botón para detener
14. Rendimiento

## 1. Estructura de la tarjeta: caja, anclaje, capas

```html
<a class="tile tile--drawn" href="/red/">
  <!-- El dibujo quieto. -->
  <svg class="tile-art" width="100%" height="100%" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 300 280" width="100%" height="100%" preserveAspectRatio="xMaxYMin meet" overflow="visible">
      <g fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.4">…</g>
    </svg>
  </svg>
  <!-- Las partes que se mueven. -->
  <svg class="tile-art tile-art--moving" width="100%" height="100%" aria-hidden="true" focusable="false">
    <svg viewBox="0 0 300 280" width="100%" height="100%" preserveAspectRatio="xMaxYMin meet" overflow="visible">
      <path class="pulse" pathLength="1" d="…" />
    </svg>
  </svg>
  <span class="tile-title">Red de datos</span>
  <span class="tile-text">Conexiones de alta capacidad en todo el país.</span>
</a>
```

```css
.tile {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;   /* el texto abajo */
    gap: 8px;
    padding: 26px 24px;
    border-radius: 12px;
}

.tile > span {
    position: relative;          /* el texto encima del dibujo */
    z-index: 2;
}

.tile-art {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    clip-path: inset(0 round 11px);  /* nada sale de la tarjeta */
    pointer-events: none;
}

.tile-art--moving {
    will-change: transform;      /* su propia capa: cada cuadro redibuja solo esto */
}

.tile--drawn::before {           /* espacio encima del texto para el dibujo */
    content: "";
    flex: none;
    height: 56px;
    margin-bottom: auto;
}

.tile--drawn .tile-title { max-width: calc(100% - 44px); }
.tile--drawn .tile-text { max-width: calc(100% - 66px); }
```

**Anclaje.** `meet` escala la caja por `min(ancho / 300, alto / 280)` y
conserva sus proporciones; `xMax` la ancla al borde derecho, y `YMin`, `YMid`
o `YMax` arriba, al centro o abajo. Elige el lado que sostiene el dibujo: un
chip cerca de arriba (`YMin`), un medidor centrado en el borde derecho
(`YMid`), edificios parados en el suelo (`YMax`).

**Llegar a los bordes.** Las partes que deben llegar a un borde sea cual sea
el tamaño de la tarjeta (un cable que sube desde abajo, una torre que se sale
por arriba, pistas que salen por la izquierda) se dibujan mucho más allá de
la caja; el `clip-path` las corta en la tarjeta, esquinas redondeadas
incluidas.

**Dibujos divididos.** Cuando una parte del dibujo debe quedarse arriba (una
línea encima del título) y otra debe estar parada en el suelo, pon dos `<svg>`
anidados en el mismo SVG exterior, `xMaxYMin meet` y `xMaxYMax meet`. Los dos
tienen la misma escala y el mismo borde derecho, así que coinciden a lo
ancho; a lo alto se separan cuando la tarjeta crece. Una forma que abarca las
dos (una torre alta) va en la de arriba y baja más allá del suelo; un
rectángulo del color de la tarjeta en la de abajo tapa su pie.

**Por qué dos capas.** El dibujo quieto puede verse un poco desenfocado detrás
del texto (una copia borrosa enmascarada con las cajas del texto); una copia
borrosa de las partes que se mueven se recalcularía en cada cuadro, así que
ahí se ocultan, y en su propia capa solo ellas se vuelven a pintar.

**Cuidado con las reglas genéricas.** Una regla pensada para el texto, como
`.tile > :not(svg) { position: relative; }`, atrapa también cualquier elemento
decorativo que añadas como hijo (un span para una luz en el borde). Dale a
los elementos decorativos su propia posición explícita, o exclúyelos de la
regla, y revisa su `position` calculada en el navegador.

## 2. Luz que corre por una línea

```html
<path class="pulse" pathLength="1" d="M-200 40 L120 40 L150 70 L150 400"
      fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
```

```css
.pulse {
    stroke-dasharray: 0.08 2;
    stroke-dashoffset: 0.1;
    animation: pulse 4.4s linear infinite;
}

@keyframes pulse {
    0% { stroke-dashoffset: 0.1; }
    60%, 100% { stroke-dashoffset: -1.01; }
}
```

- `pathLength="1"` mide el trazo en fracciones del recorrido, sea cual sea su
  largo real.
- El hueco (2) es más largo que el recorrido (1), así que hay un solo trazo.
- El trazo empieza justo antes del recorrido (largo del trazo + 0,02) y
  termina justo después (-1,01). Detenido justo en un extremo, el remate
  redondo dejaría un punto.
- La luz cruza en el primer 60 % del ciclo; luego el recorrido queda oscuro
  hasta el ciclo siguiente.
- **Velocidad constante:** recorridos de largos distintos necesitan sus
  propios keyframes, con un cruce de `largo / velocidad` segundos del ciclo.
  Genéralos (ver `generator.md`).
- **Brillo:** el mismo recorrido debajo, con `stroke-width="6" stroke-opacity="0.2"`
  y la misma clase.
- **Canales:** varias pistas paralelas con la misma animación y retardos de
  0,06 s entre sí se leen como datos que viajan juntos.

## 3. Un solo ciclo, retardos calculados

Dale a todas las animaciones de una tarjeta la misma duración (el ciclo) y
coloca cada parte dentro de él con `animation-delay`. Así siguen sincronizadas
cuando cambia la velocidad al pasar el puntero o cuando se pausan, y sus
tiempos se pueden calcular a partir de la geometría:

- Un pulso que cruza en T segundos, con su desfase yendo de `s` a `-1.01` y un
  trazo `d`, llega al final de su recorrido en `T × (1 + s - d) / (s + 1.01)`.
- Una luz que debe encenderse cuando llega el pulso recibe el retardo del
  pulso más ese tiempo.
- Las etapas se suceden: pisos que se encienden de arriba abajo, por ejemplo,
  con 0,055 s entre uno y otro.

Los retardos negativos sirven: la animación empieza a mitad de su ciclo. Si un
script mueve los nodos del SVG después de cargar la página, sus animaciones
se reinician juntas, y un ciclo compartido las mantiene sincronizadas.

## 4. Encender partes

```css
.lit {
    opacity: 0;
    animation: lit 6.4s linear infinite;
}

@keyframes lit {
    0% { opacity: 0; }
    3% { opacity: 1; }
    42% { opacity: 1; }
    52%, 100% { opacity: 0; }
}
```

```html
<g class="lit" style="animation-delay: 1.45s"><rect x="253" y="68" width="5" height="7" /></g>
```

La versión apagada se queda en el dibujo quieto (ventanas al 20 % de blanco,
por ejemplo); la copia encendida, en blanco pleno, va en la capa que se mueve.
Para que un punto destelle y crezca, añade
`transform-box: fill-box; transform-origin: center;` y anima un `scale()`.

## 5. Rotación: agujas y diales

```css
.needle {
    transform-origin: 298px 142px;   /* el eje, en las unidades del dibujo */
    animation: needle 7s ease-in-out infinite;
}

@keyframes needle {
    0%, 100% { transform: rotate(-10deg); }
    12% { transform: rotate(15deg); }
    22% { transform: rotate(5deg); }
    36% { transform: rotate(25deg); }
    50% { transform: rotate(-7.5deg); }
    61% { transform: rotate(-22.5deg); }
    74% { transform: rotate(2.5deg); }
    87% { transform: rotate(-15deg); }
}
```

En elementos SVG, un `transform-origin` en px está en las unidades del propio
dibujo. Paradas desiguales se ven vivas; paradas iguales se ven mecánicas. Sin
movimiento, la aguja descansa en 0°: dibuja la escala para que esa posición
signifique algo (la marca del centro). Comprueba que la punta de la aguja no
toque el texto en los dos extremos de su recorrido.

## 6. Brillos sin filtros

Una copia más ancha y translúcida del trazo, debajo de él:
`stroke-width="6" stroke-opacity="0.16"`. Los filtros SVG y CSS (`blur`,
`drop-shadow`) sobre algo que se mueve se recalculan en cada cuadro.

## 7. Haces de pistas paralelas

Los haces al estilo de un circuito (varias pistas paralelas con dobleces a 45°)
salen de una línea central, desplazada hacia un lado para cada pista. Las
esquinas en inglete mantienen las pistas paralelas en los dobleces:

```python
import math


def offset_polyline(points, offset):
    """La poligonal desplazada hacia un lado, con esquinas en inglete."""
    def normal(a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        n = math.hypot(dx, dy)
        return -dy / n, dx / n

    out = []
    for i, p in enumerate(points):
        if i == 0:
            nx, ny = normal(points[0], points[1])
        elif i == len(points) - 1:
            nx, ny = normal(points[-2], points[-1])
        else:
            n1, n2 = normal(points[i - 1], p), normal(p, points[i + 1])
            d = 1 + n1[0] * n2[0] + n1[1] * n2[1]
            nx, ny = (n1[0] + n2[0]) / d, (n1[1] + n2[1]) / d
        out.append((p[0] + offset * nx, p[1] + offset * ny))
    return out


centro = [(162, 67.5), (134, 67.5), (110, 43.5), (-440, 43.5)]  # desde las patas de un chip hacia afuera
pistas = [offset_polyline(centro, (i - 1.5) * 9) for i in range(4)]  # cuatro pistas, a 9 de distancia
```

Empieza un haz en las patas de un componente (con el mismo paso de 9
unidades) y termínalo en almohadillas redondas, o sácalo por el borde de la
tarjeta.

## 8. Curvas paralelas

Un cable de tres fibras que cuelga siguiendo una curva cuadrática: desplaza
los dos tramos del polígono de control y únelos donde se cruzan (el método de
Tiller y Hanson, suficiente en una curva suave):

```python
def offset_quadratic(p0, p1, p2, offset):
    def moved(a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        n = math.hypot(dx, dy)
        nx, ny = -dy / n * offset, dx / n * offset
        return (a[0] + nx, a[1] + ny), (b[0] + nx, b[1] + ny)

    (a0, a1), (b0, b1) = moved(p0, p1), moved(p1, p2)
    d1, d2 = (a1[0] - a0[0], a1[1] - a0[1]), (b1[0] - b0[0], b1[1] - b0[1])
    t = ((b0[0] - a0[0]) * d2[1] - (b0[1] - a0[1]) * d2[0]) / (d1[0] * d2[1] - d1[1] * d2[0])
    control = (a0[0] + t * d1[0], a0[1] + t * d1[1])
    return f"M{a0[0]:.1f} {a0[1]:.1f} Q{control[0]:.1f} {control[1]:.1f} {b1[0]:.1f} {b1[1]:.1f}"


fibras = [offset_quadratic((-420, 8), (-30, 80), (240, 50), k * 4.5) for k in (-1, 0, 1)]
```

## 9. Formas sólidas y orden de dibujo

- Rellena con el color de fondo de la tarjeta cada forma que esté delante de
  otra. Solo con contornos se transparenta: un edificio dibujado con líneas
  deja ver el de atrás por sus huecos.
- Las columnas y otros detalles abiertos necesitan una pared rellena detrás.
- Las luces van debajo de lo que las tapa. Si un edificio está delante de las
  ventanas encendidas de otro y las luces viven en la capa que se mueve, dibuja
  también el edificio de adelante en esa capa, después de las luces. Lo que
  deba pasar por delante de él (una luz que corre por el suelo) va después.
- Tapa el pie de una forma alta que baja más allá del suelo con un rectángulo
  del color de la tarjeta debajo de la línea del suelo.

## 10. Texto y dibujo lado a lado

- Reserva el espacio: el espaciador `::before` arriba, y un `max-width` en el
  texto donde el dibujo está al lado.
- Una tarjeta cuyo dibujo es ancho a la altura del título recibe su propio
  límite en el título, en `em`, para que el corte de línea no dependa del ancho
  de la tarjeta: `max-width: min(calc(100% - 44px), 11.5em)` mantiene un
  título largo en dos líneas estables.
- Mide con `scripts/text-boxes.js` en todos los anchos. La distribución más
  angosta con tarjetas lado a lado es donde el texto se parte más y las
  tarjetas crecen más. Marca con `data-keep-clear` las formas que deben quedar
  libres para obtener la lista de todo lo que el texto toca.
- Cuando las líneas tengan que pasar detrás del texto, suavízalas solo ahí
  (una máscara hecha con las cajas del texto, con una copia un poco borrosa
  detrás) y oculta ahí las partes que se mueven. Nunca atenúes todo el dibujo
  para hacerle sitio al texto.

## 11. Acelerar al pasar el puntero

Cambia la velocidad con `playbackRate`, de forma gradual, no cambiando
`animation-duration` (eso reinicia el ciclo y el movimiento salta):

```js
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".tile").forEach((tile) => {
        let frame = null;
        const rampTo = (target) => {
            cancelAnimationFrame(frame);
            const animations = tile.getAnimations({ subtree: true });
            const start = animations.length ? animations[0].playbackRate : 1;
            const t0 = performance.now();
            (function step(now) {
                const k = Math.min((now - t0) / 400, 1);
                animations.forEach((a) => { a.playbackRate = start + (target - start) * k; });
                if (k < 1) frame = requestAnimationFrame(step);
            })(t0);
        };
        tile.addEventListener("mouseenter", () => rampTo(3));
        tile.addEventListener("mouseleave", () => rampTo(1));
        tile.addEventListener("focusin", () => rampTo(3));
        tile.addEventListener("focusout", () => rampTo(1));
    });
}
```

## 12. Pausar fuera de pantalla

```js
const watcher = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle("is-offscreen", !e.isIntersecting));
});
document.querySelectorAll(".tile").forEach((tile) => watcher.observe(tile));
```

```css
.tile.is-offscreen * {
    animation-play-state: paused !important;
}
```

## 13. Movimiento reducido y botón para detener

```css
/* Después de toda regla que inicia estas animaciones: con la misma
   especificidad, gana la regla posterior. */
@media (prefers-reduced-motion: reduce) {
    .pulse,
    .lit,
    .needle {
        animation: none;
    }
}

/* El control del sitio para detener animaciones, si añade una clase a <html>. */
.motion-off .pulse,
.motion-off .lit,
.motion-off .needle {
    animation: none !important;
}
```

Diseña el estado quieto: luces apagadas (descansan en `opacity: 0`), pulsos
fuera de sus recorridos, la aguja en su marca de reposo. Toma una captura con
`--reduced-motion`: debe verse terminada. Una prueba que lea la hoja de
estilos puede comprobar que el bloque de movimiento reducido va después de las
reglas de animación y lista cada clase animada (`generator.md` tiene una).

## 14. Rendimiento

- Anima `transform`, `opacity` y `stroke-dashoffset`. Pon las partes que se
  mueven en su propio SVG con `will-change: transform`.
- Nada de filtros en las partes que se mueven; los brillos son trazos.
- Pausa fuera de pantalla, y mantén las partes en movimiento en decenas, no en
  miles.
