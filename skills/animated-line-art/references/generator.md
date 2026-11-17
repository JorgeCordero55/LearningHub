# Generar la geometría y los tiempos

Cuando un dibujo necesita más que unos pocos números (pistas paralelas,
decenas de ventanas, retardos calculados a partir de largos y velocidades),
escríbelos con un script pequeño en vez de a mano, y prueba que la página
tiene exactamente lo que el script escribe. Cambiar un número pasa a ser:
editar el script, correrlo, correr las pruebas. Sin esto, un número cambiado
en un solo lugar (una duración en el CSS, un recorrido en la plantilla) rompe
los tiempos en silencio: una luz se enciende antes de que le llegue el pulso,
y nada avisa del error.

## El patrón

- El script calcula el marcado (las dos capas SVG) y las reglas CSS que le dan
  sus tiempos (keyframes cuyos porcentajes salen de largos y velocidades).
- La plantilla y la hoja de estilos tienen bloques marcados que el script
  reemplaza. Usa comentarios que el lenguaje de plantillas elimine:
  - plantilla: `{# Drawn by tools/tile_art.py (fiber) #}` … `{# End of the drawing (fiber) #}`
  - CSS: `/* Drawn by tools/tile_art.py: start */` … `/* Drawn by tools/tile_art.py: end */`
- `python tools/tile_art.py` imprime los bloques; `python tools/tile_art.py --write`
  los pone en los archivos (conservando sus finales de línea).
- Una prueba carga el script y comprueba que cada bloque generado aparece,
  idéntico, en los archivos.
- Mantén la salida determinista: redondeo fijo, y una semilla fija para
  cualquier azar (`random.Random(3)`), o la prueba fallará al azar.
- El bloque de movimiento reducido va después del bloque CSS generado, y una
  segunda prueba comprueba que detiene cada clase animada.

## Esqueleto

```python
"""Dibuja las ilustraciones de las tarjetas y las reglas que les dan sus tiempos.

    python tools/tile_art.py          las imprime
    python tools/tile_art.py --write  las pone en la plantilla y en la hoja de estilos
"""
import math
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "templates" / "_tiles.html"
CSS = ROOT / "static" / "css" / "main.css"
CSS_START = "/* Drawn by tools/tile_art.py: start */\n"
CSS_END = "/* Drawn by tools/tile_art.py: end */\n"
MOVING = ("fiber-pulse",)  # cada clase animada; las pruebas comprueban que todas se detienen


def f(v):
    """Una coordenada, con un decimal como máximo."""
    return f"{v:.1f}".rstrip("0").rstrip(".")


def rule(selector, *declarations):
    body = "\n".join(f"    {d};" for d in declarations)
    return f"{selector} {{\n{body}\n}}"


def keyframes(name, *stops):
    body = "\n".join(f"    {s}" for s in stops)
    return f"@keyframes {name} {{\n{body}\n}}"


def length(points):
    return sum(math.dist(a, b) for a, b in zip(points, points[1:]))


def fiber():
    cycle, speed, dash = 4.4, 170, 26  # s, px/s, px
    line = [(-440, 43.5), (110, 43.5), (134, 67.5), (162, 67.5)]
    travel = length(line) / speed
    d = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in line)
    markup = f'        <path class="fiber-pulse" pathLength="1" d="{d}" />'
    share = dash / length(line)
    css = "\n\n".join([
        rule(".fiber-pulse", f"stroke-dasharray: {share:.4f} 2", f"stroke-dashoffset: {share + 0.01:.4f}",
             f"animation: fiberPulse {cycle:g}s linear infinite"),
        keyframes("fiberPulse", f"0% {{ stroke-dashoffset: {share + 0.01:.4f}; }}",
                  f"{100 * travel / cycle:.2f}%, 100% {{ stroke-dashoffset: -1.01; }}"),
    ])
    return markup, css


def tiles():
    """nombre -> (marcado para la plantilla, reglas para la hoja de estilos)."""
    return {"fiber": fiber()}


def markers(name):
    return f"        {{# Drawn by tools/tile_art.py ({name}) #}}\n", f"        {{# End of the drawing ({name}) #}}\n"


def replace_between(text, start, end, new):
    a = text.index(start) + len(start)
    return text[:a] + new + text[text.index(end, a):]


def write():
    drawn = tiles()
    html = TEMPLATE.read_text(encoding="utf-8")
    for name, (markup, _) in drawn.items():
        html = replace_between(html, *markers(name), markup + "\n")
    css = replace_between(CSS.read_text(encoding="utf-8"), CSS_START, CSS_END,
                          "\n\n".join(rules for _, rules in drawn.values()) + "\n")
    for path, text in ((TEMPLATE, html), (CSS, css)):
        with open(path, "w", encoding="utf-8", newline="\n") as out:  # conserva los finales LF
            out.write(text)


if __name__ == "__main__":
    if "--write" in sys.argv:
        write()
        print("Dibujos escritos en la plantilla y en la hoja de estilos.")
    else:
        for name, (markup, rules) in tiles().items():
            print(f"===== {name}\n{markup}\n\n{rules}\n")
```

## Pruebas

```python
import importlib.util
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def tile_art():
    spec = importlib.util.spec_from_file_location("tile_art", ROOT / "tools" / "tile_art.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_drawings_and_timings_match_the_generator():
    art = tile_art()
    html = (ROOT / "templates" / "_tiles.html").read_text(encoding="utf-8")
    css = (ROOT / "static" / "css" / "main.css").read_text(encoding="utf-8")
    for name, (markup, rules) in art.tiles().items():
        assert markup in html, f"{name}: corre tools/tile_art.py --write"
        assert rules in css, f"{name}: corre tools/tile_art.py --write"


def test_every_animation_stops_without_motion():
    art = tile_art()
    css = (ROOT / "static" / "css" / "main.css").read_text(encoding="utf-8")
    # El bloque de movimiento reducido debe ir después de las reglas generadas, o ellas ganan.
    block = css.index("@media (prefers-reduced-motion: reduce) {", css.index(art.CSS_END))
    still = css[block:css.index("\n}\n", block)]
    assert "animation: none" in still
    for name in art.MOVING:
        assert re.search(rf"\.{name}[,\s]", still), f"{name} sigue moviéndose con movimiento reducido"
```

Comprueba que una prueba puede fallar antes de confiar en ella: cambia a mano
un número generado en la hoja de estilos, corre la prueba (debe fallar) y deja
el archivo como estaba.
