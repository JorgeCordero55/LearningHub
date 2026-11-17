#!/usr/bin/env node
// shoot.mjs: mirar una página web como la vería una persona, desde un script.
// Maneja Microsoft Edge o Google Chrome sin interfaz por el protocolo DevTools,
// con fetch y WebSocket de Node (Node 22+, nada que instalar).
const HELP = `Uso: node shoot.mjs --url <url> --out <archivo.png> [opciones]

  --url <url>              la página a abrir (obligatoria)
  --out <archivo.png>      dónde guardar la captura (obligatoria salvo con --no-shot)
  --width <px>             ancho de la ventana (1440 por defecto); por debajo de 700 emula un teléfono
  --height <px>            alto de la ventana (900 por defecto)
  --full                   la página entera en vez de la ventana
  --selector <css>         solo este elemento (el primero que coincida), más --pad alrededor
  --pad <px>               margen alrededor de --selector (8 por defecto)
  --scale <n>              amplía la imagen: 2 = el doble de píxeles, para detalles (1 por defecto)
  --time <ms>              congela primero todas las animaciones en este punto de su línea de tiempo
  --reduced-motion         emula prefers-reduced-motion: reduce
  --wait <ms>              espera tras cargar, para fuentes y scripts (1200 por defecto)
  --header "Nombre: valor" añade un encabezado a las solicitudes del propio sitio (repetible),
                           p. ej. para sitios que excluyen sus propias revisiones de las
                           estadísticas de visitas. Nunca se envía a otros orígenes: allí
                           provocaría una verificación previa de CORS y las fuentes web fallarían.
  --eval <archivo.js>      evalúa la expresión de este archivo en la página (después de --time)
                           e imprime el resultado; puede devolver una promesa
  --arg clave=valor        se pasa a --eval como window.__shoot.clave (repetible)
  --no-shot                solo corre --eval
  --browser <ruta>         el navegador a usar (o define BROWSER_PATH)

Ejemplos:
  node shoot.mjs --url http://127.0.0.1:8000/ --out fila.png --selector ".tiles" --time 2400
  node shoot.mjs --url http://127.0.0.1:8000/ --out tarjeta.png --selector ".tile:nth-child(2)" --scale 3
  node shoot.mjs --url http://127.0.0.1:8000/ --out telefono.png --width 390 --full --reduced-motion
  node shoot.mjs --url http://127.0.0.1:8000/ --no-shot --eval text-boxes.js --arg "tiles=.tile"`;

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { platform, tmpdir } from "node:os";
import { join, resolve } from "node:path";

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

class UsageError extends Error {}

function parseArgs(argv) {
    const opts = { width: 1440, height: 900, wait: 1200, pad: 8, scale: 1, headers: [], args: {} };
    for (let i = 0; i < argv.length; i++) {
        const flag = argv[i];
        const value = () => {
            if (i + 1 >= argv.length) throw new UsageError(`${flag} necesita un valor`);
            return argv[++i];
        };
        const number = () => {
            const n = Number(value());
            if (!Number.isFinite(n)) throw new UsageError(`${flag} necesita un número`);
            return n;
        };
        switch (flag) {
            case "--url": opts.url = value(); break;
            case "--out": opts.out = value(); break;
            case "--width": opts.width = number(); break;
            case "--height": opts.height = number(); break;
            case "--full": opts.full = true; break;
            case "--selector": opts.selector = value(); break;
            case "--pad": opts.pad = number(); break;
            case "--scale": opts.scale = number(); break;
            case "--time": opts.time = number(); break;
            case "--reduced-motion": opts.reduced = true; break;
            case "--wait": opts.wait = number(); break;
            case "--header": {
                const header = value();
                const colon = header.indexOf(":");
                if (colon < 1) throw new UsageError(`--header espera "Nombre: valor", recibió ${header}`);
                opts.headers.push({ name: header.slice(0, colon).trim(), value: header.slice(colon + 1).trim() });
                break;
            }
            case "--eval": opts.eval = value(); break;
            case "--arg": {
                const pair = value();
                const eq = pair.indexOf("=");
                if (eq < 1) throw new UsageError(`--arg espera clave=valor, recibió ${pair}`);
                opts.args[pair.slice(0, eq)] = pair.slice(eq + 1);
                break;
            }
            case "--no-shot": opts.noShot = true; break;
            case "--browser": opts.browser = value(); break;
            case "-h":
            case "--help": console.log(HELP); process.exit(0);
            default: throw new UsageError(`opción desconocida ${flag} (ver --help)`);
        }
    }
    if (!opts.url) throw new UsageError("falta --url");
    if (!opts.out && !opts.noShot) throw new UsageError("falta --out (o --no-shot con --eval)");
    if (opts.noShot && !opts.eval) throw new UsageError("--no-shot necesita --eval");
    return opts;
}

function findBrowser(explicit) {
    const wanted = explicit || process.env.BROWSER_PATH;
    if (wanted) {
        if (existsSync(wanted)) return wanted;
        throw new UsageError(`no hay navegador en ${wanted}`);
    }
    const candidates = [];
    if (platform() === "win32") {
        for (const base of [process.env["ProgramFiles(x86)"], process.env.ProgramFiles, process.env.LOCALAPPDATA]) {
            if (!base) continue;
            candidates.push(join(base, "Microsoft", "Edge", "Application", "msedge.exe"));
            candidates.push(join(base, "Google", "Chrome", "Application", "chrome.exe"));
        }
    } else if (platform() === "darwin") {
        candidates.push(
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
        );
    }
    for (const path of candidates) if (existsSync(path)) return path;
    for (const name of ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge", "msedge", "chrome"]) {
        const found = spawnSync(platform() === "win32" ? "where" : "which", [name], { encoding: "utf8" });
        if (found.status === 0 && found.stdout.trim()) return found.stdout.trim().split(/\r?\n/)[0];
    }
    throw new UsageError("no se encontró Edge ni Chrome: pasa --browser <ruta> o define BROWSER_PATH");
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    const executable = findBrowser(opts.browser);
    const profile = mkdtempSync(join(tmpdir(), "shoot-"));
    const browser = spawn(executable, [
        "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        "--no-default-browser-check", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank",
    ], { stdio: "ignore" });
    let socket;
    try {
        // El navegador elige un puerto libre y lo escribe en DevToolsActivePort.
        let port = 0;
        for (let i = 0; i < 150 && !port; i++) {
            try {
                port = Number(readFileSync(join(profile, "DevToolsActivePort"), "utf8").split(/\r?\n/)[0]) || 0;
            } catch {
                // todavía no está escrito, o el navegador aún lo tiene bloqueado (Windows)
            }
            if (!port) await sleep(100);
        }
        if (!port) throw new Error("el navegador no arrancó");
        let target;
        for (let i = 0; i < 50 && !target; i++) {
            try {
                const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
                target = list.find((t) => t.type === "page");
            } catch {
                // todavía no está listo
            }
            if (!target) await sleep(100);
        }
        if (!target) throw new Error("no hay página que manejar");

        socket = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((open, fail) => {
            socket.addEventListener("open", open);
            socket.addEventListener("error", () => fail(new Error("no se pudo conectar con el navegador")));
        });
        let lastId = 0;
        const pending = new Map();
        const events = new Set();
        const send = (method, params = {}) => new Promise((done) => {
            const id = ++lastId;
            pending.set(id, done);
            socket.send(JSON.stringify({ id, method, params }));
        });
        socket.addEventListener("message", (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id && pending.has(msg.id)) {
                pending.get(msg.id)(msg);
                pending.delete(msg.id);
            } else if (msg.method === "Fetch.requestPaused") {
                const headers = Object.entries(msg.params.request.headers).map(([name, value]) => ({ name, value }));
                send("Fetch.continueRequest", { requestId: msg.params.requestId, headers: headers.concat(opts.headers) });
            } else if (msg.method) {
                events.add(msg.method);
            }
        });
        const evaluate = async (expression) => {
            const reply = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
            if (reply.error) throw new Error(reply.error.message);
            const thrown = reply.result.exceptionDetails;
            if (thrown) throw new Error(`en la página: ${thrown.exception?.description || thrown.text}`);
            return reply.result.result.value;
        };

        await send("Page.enable");
        if (opts.headers.length) {
            // Solo el origen de la página: en otros, el encabezado forzaría verificaciones previas de CORS.
            await send("Fetch.enable", { patterns: [{ urlPattern: `${new URL(opts.url).origin}/*` }] });
        }
        await send("Emulation.setDeviceMetricsOverride", {
            width: opts.width, height: opts.height, deviceScaleFactor: 1, mobile: opts.width < 700,
        });
        if (opts.reduced) {
            await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
        }
        await send("Page.navigate", { url: opts.url });
        for (let i = 0; i < 300 && !events.has("Page.loadEventFired"); i++) await sleep(100);
        await evaluate("document.fonts ? document.fonts.ready.then(() => true) : true");
        await sleep(opts.wait);

        if (opts.time !== undefined) {
            await evaluate(`document.getAnimations().forEach((a) => { a.pause(); a.currentTime = ${opts.time}; }); true`);
            await sleep(200);
        }
        if (opts.eval) {
            await evaluate(`window.__shoot = ${JSON.stringify(opts.args)}; true`);
            const value = await evaluate(readFileSync(resolve(opts.eval), "utf8"));
            console.log(typeof value === "string" ? value : JSON.stringify(value, null, 2));
        }
        if (!opts.noShot) {
            const params = { format: "png", captureBeyondViewport: true };
            if (opts.selector) {
                const box = await evaluate(`(() => {
                    const el = document.querySelector(${JSON.stringify(opts.selector)});
                    if (!el) return null;
                    const r = el.getBoundingClientRect();
                    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
                })()`);
                if (!box) throw new UsageError(`nada coincide con ${opts.selector}`);
                const x = Math.max(0, box.x - opts.pad), y = Math.max(0, box.y - opts.pad);
                params.clip = { x, y, width: box.x + box.width + opts.pad - x, height: box.y + box.height + opts.pad - y, scale: opts.scale };
            } else if (opts.full) {
                const metrics = await send("Page.getLayoutMetrics");
                params.clip = { x: 0, y: 0, width: opts.width, height: Math.ceil(metrics.result.cssContentSize.height), scale: opts.scale };
            } else {
                const scroll = await evaluate("({ x: scrollX, y: scrollY })");
                params.clip = { x: scroll.x, y: scroll.y, width: opts.width, height: opts.height, scale: opts.scale };
            }
            const shot = await send("Page.captureScreenshot", params);
            if (shot.error) throw new Error(shot.error.message);
            writeFileSync(opts.out, Buffer.from(shot.result.data, "base64"));
            console.log(`guardada ${opts.out}`);
        }
    } finally {
        try { socket?.close(); } catch { /* ya estaba cerrado */ }
        browser.kill();
        await sleep(300);
        try { rmSync(profile, { recursive: true, force: true }); } catch { /* aún bloqueado: el sistema limpia temp */ }
    }
}

main().then(() => process.exit(0), (error) => {
    console.error(`shoot: ${error.message}`);
    process.exit(error instanceof UsageError ? 2 : 1);
});
