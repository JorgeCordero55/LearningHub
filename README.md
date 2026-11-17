# LearningHub: lecciones para agentes de IA que programan

Los agentes de IA que programan (Claude Code, Codex, Copilot, Cursor...)
olvidan todo entre una conversación y otra, así que repiten los mismos
errores. Este repositorio lo resuelve: cuando corriges a un agente, este
anota el error como una regla, y cada conversación posterior, en cualquier
proyecto, lee esas reglas antes de trabajar.

Viene con lecciones aprendidas en proyectos reales (`GENERAL.md`). Tu copia
es tuya: tus agentes le añaden tus propias lecciones.

## Qué contiene

- `GENERAL.md`: lecciones que sirven para cualquier proyecto.
- `template/`: los archivos con los que empieza un proyecto (`AGENTS.md`,
  `CLAUDE.md`, `docs/ai/LESSONS.md`).
- `skills/`: skills para Claude, cada una en su carpeta (ver
  [Skills](#skills)).

Cada proyecto tiene además su propio `docs/ai/LESSONS.md` para lecciones
que solo tienen sentido allí (sus carpetas, sus servidores, las decisiones
de su cliente).

## Instalación (una vez por computadora)

### 1. Descarga los archivos

Pon el repositorio en la misma carpeta que tus proyectos, con el nombre
`LearningHub`, para que cada proyecto lo encuentre en `../LearningHub/`:

```
codigo/
├── LearningHub/      <- este repositorio
├── proyecto-a/
└── proyecto-b/
```

- **Con git:** en esa carpeta, ejecuta
  `git clone https://github.com/JorgeCordero55/LearningHub.git`
- **Sin git:** en GitHub, **Code → Download ZIP**, descomprímelo allí y
  cambia el nombre de la carpeta a `LearningHub`.

### 2. Claude Code: cargar las lecciones en cada conversación

Crea (o añade al final de) el archivo `CLAUDE.md` dentro de la carpeta
`.claude` de tu usuario (en Windows: `C:\Users\<tu usuario>\.claude\CLAUDE.md`):

```markdown
# Lecciones compartidas para todos los proyectos

Las lecciones de abajo vienen de errores que cometieron agentes de IA en
proyectos anteriores; también aplican aquí. El README.md del repositorio
explica cómo funciona.

Cuando el usuario corrija un error tuyo, añade una lección en ese mismo
turno: al GENERAL.md del repositorio si serviría en otro proyecto; si no, al
docs/ai/LESSONS.md del proyecto (créalo desde template/ si el proyecto no lo
tiene).

@~/codigo/LearningHub/GENERAL.md
```

Cambia la última línea por la ruta de tu carpeta `LearningHub`. `~` es tu
carpeta de usuario (`C:\Users\<tu usuario>`). Pon una barra invertida antes
de cada espacio de la ruta:
`@~/OneDrive\ -\ Empresa/codigo/LearningHub/GENERAL.md`.

**Comprueba que funciona:** abre Claude Code en cualquier carpeta y
pregúntale "¿Qué dice GENERAL.md sobre las anotaciones en capturas de
pantalla?". Debe responder con lo que dice el archivo.

### 3. Otros agentes

La mayoría de las demás herramientas (Codex, Copilot, Cursor...) leen el
`AGENTS.md` de la carpeta del proyecto. El `AGENTS.md` de la plantilla las
dirige a `../LearningHub/GENERAL.md` y a las lecciones del propio proyecto.

## Añadirlo a un proyecto

- **Proyecto nuevo:** copia todo lo que hay en `template/` a la carpeta del
  proyecto (conserva las carpetas `docs/ai/`) y completa `AGENTS.md`: qué es
  el proyecto, cómo se ejecutan sus pruebas, cómo llega a producción.
- **Proyecto existente:** si ya tiene un `AGENTS.md` o un `CLAUDE.md`, añade
  las líneas de la plantilla a esos archivos en vez de reemplazarlos.

## Cómo se añade una lección

Cuando corriges un error de un agente, este añade una lección en ese mismo
turno (la instalación de arriba se lo indica). También puedes pedírselo:
"añade una lección sobre esto".

1. **Dónde:** en `GENERAL.md` si serviría en otro proyecto; si no, en el
   `docs/ai/LESSONS.md` del proyecto.
2. **Qué:** lo que pasó (una o dos líneas, con la fecha) y la regla que lo
   evita. Mejor una regla que se pueda comprobar.
3. **Si una regla se sigue rompiendo,** conviértela en un hook o una regla de
   bloqueo en el `.claude/settings.json` del proyecto en vez de repetirla más
   fuerte: las reglas escritas son consejos; los hooks se cumplen a la fuerza.

Mantén ambos archivos cortos (cada uno se carga en todas las
conversaciones): une las lecciones repetidas y quita las que ya no apliquen.
Nunca pongas contraseñas ni claves en ninguno de los dos.

## Skills

Una skill es una carpeta con instrucciones (y a veces scripts) que Claude
carga cuando lo que le pides encaja con su descripción. Le da a tu agente el
proceso, las técnicas y las revisiones con las que se consiguió un buen
resultado, en vez de dejar que improvise.

- `skills/animated-line-art/`: dibujos de líneas animados (SVG y CSS) para
  tarjetas, banners y secciones de un sitio web. Trae el proceso (conceptos y
  vista previa antes de construir), las técnicas con código, una lista de
  errores que ya se cometieron, y un script que deja al agente fotografiar,
  congelar y medir la página en un navegador sin interfaz. Necesita Node.js
  22 o más reciente y Microsoft Edge o Google Chrome.

Para instalar una skill:

- **Claude Code, en todos tus proyectos:** copia su carpeta a `.claude/skills/`
  dentro de tu carpeta de usuario (en Windows:
  `C:\Users\<tu usuario>\.claude\skills\`).
- **Claude Code, en un proyecto:** cópiala a `.claude/skills/` dentro del
  proyecto y haz commit, para que todo el equipo la tenga.
- **App de Claude (web o escritorio):** comprime la carpeta de la skill en un
  `.zip` y súbelo como skill personalizada, si tu organización lo permite.

Claude la usa por su cuenta cuando tu pedido encaja; también puedes pedirla
por su nombre: "usa la skill animated-line-art". La carpeta `evals/` de cada
skill trae casos de prueba; no hace falta copiarla.

## Actualizaciones

Solo el dueño modifica este repositorio. Para recibir las lecciones que se
añadan después: con git, ejecuta `git pull` en tu carpeta `LearningHub`
(antes guarda tus lecciones con un commit para que git pueda unirlas); sin
git, descarga el ZIP otra vez y copia las lecciones que no tengas.
