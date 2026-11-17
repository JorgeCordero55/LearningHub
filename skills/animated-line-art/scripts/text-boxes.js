// text-boxes.js: dónde está el texto en cada tarjeta y qué toca.
// Una expresión para shoot.mjs --eval:
//
//   node shoot.mjs --url http://127.0.0.1:8000/ --no-shot --eval text-boxes.js \
//       --arg "tiles=.tile" --arg "keep-clear=[data-keep-clear]"
//
// Para cada elemento que coincide con "tiles" ([data-tile] por defecto): su
// tamaño y la caja que rodea la tinta de su texto (las letras mismas, a partir
// de las cajas de línea del texto, no de los elementos), relativa a la
// tarjeta. Con "keep-clear", también las cajas de esas partes del dibujo
// dentro de la tarjeta, y cada línea de texto que queda a menos de "gap" px de
// una (8 por defecto): la lista de lo que hay que arreglar.
(() => {
    const args = window.__shoot || {};
    const keep = args["keep-clear"];
    const gap = Number(args.gap || 8);
    const relative = (r, t) => ({
        left: Math.round(r.left - t.left),
        top: Math.round(r.top - t.top),
        right: Math.round(r.right - t.left),
        bottom: Math.round(r.bottom - t.top),
    });
    return Array.from(document.querySelectorAll(args.tiles || "[data-tile]")).map((tile, index) => {
        const t = tile.getBoundingClientRect();
        const lines = [];
        const walker = document.createTreeWalker(tile, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.data.trim() && !node.parentElement.closest("svg, script, style")
                ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
        });
        const range = document.createRange();
        while (walker.nextNode()) {
            range.selectNodeContents(walker.currentNode);
            for (const r of range.getClientRects()) if (r.width && r.height) lines.push(r);
        }
        const result = { tile: index + 1, width: Math.round(t.width), height: Math.round(t.height), lines: lines.length };
        if (lines.length) {
            result.textInk = relative({
                left: Math.min(...lines.map((r) => r.left)),
                top: Math.min(...lines.map((r) => r.top)),
                right: Math.max(...lines.map((r) => r.right)),
                bottom: Math.max(...lines.map((r) => r.bottom)),
            }, t);
        }
        if (keep) {
            const parts = Array.from(tile.querySelectorAll(keep))
                .map((el) => el.getBoundingClientRect())
                .filter((r) => r.width || r.height);
            result.keepClear = parts.map((r) => relative(r, t));
            result.touching = [];
            for (const line of lines) {
                for (const part of parts) {
                    const near = line.left < part.right + gap && part.left < line.right + gap
                        && line.top < part.bottom + gap && part.top < line.bottom + gap;
                    if (near) result.touching.push({ line: relative(line, t), part: relative(part, t) });
                }
            }
        }
        return result;
    });
})()
