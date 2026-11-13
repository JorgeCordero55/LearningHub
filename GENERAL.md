# Lecciones generales para agentes de IA (todos los proyectos)

Errores que cometieron agentes de IA en proyectos reales y que pueden
repetirse en cualquier proyecto, cada uno con la regla que lo evita. Se carga
en cada conversación de Claude Code mediante `~/.claude/CLAUDE.md`; a los
demás agentes los dirige aquí el `AGENTS.md` de cada proyecto. Las lecciones
propias de un proyecto van en su `docs/ai/LESSONS.md`. Cómo añadir lecciones:
ver el `README.md` junto a este archivo.

**Este archivo es público.** Escribe las lecciones sin nombres de personas,
nombres de servidores internos, direcciones IP, rutas de archivos,
contraseñas ni datos de clientes. Eso va en el `docs/ai/LESSONS.md` del
proyecto.

## Instrucciones y alcance

- **Conoce el entorno antes de dar la alarma.** Un servidor de desarrollo
  cerrado se describió como si fuera una caída de producción pública
  (2026-11-13). **Regla:** comprueba (o pregunta) si es desarrollo, pruebas o
  público, y ajusta la urgencia y el tono del informe a eso.
- **Las anotaciones en capturas de pantalla pueden significar lo contrario de
  lo que parecen.** Un círculo rojo sobre el nombre de una carpeta quería
  decir "esta no" y se entendió como "usa esta" (2026-10-30). **Regla:**
  cuando una instrucción depende de una captura, una anotación o una frase con
  dos lecturas, di en una línea cómo la entiendes y pregunta antes de
  construir.
- **Haz exactamente lo que se pide.** "Hacer más visibles las redes sociales"
  terminó en iconos dentro de un encabezado lleno y luego en una barra
  lateral; no se quería ninguna de las dos (2026-10-30). **Regla:** ofrece los
  extras como sugerencias; no los añadas. Si vas más allá de la lista literal
  de un cliente, dilo y pregunta.
- **"El X actual" puede tener dos versiones.** El texto guardado en git y el
  texto sin guardar eran distintos (2026-11-02). **Regla:** revisa
  `git diff` / `git show HEAD:<archivo>` para saber qué versión está viendo
  el usuario.

## Contenido y datos

- **Nunca publiques nombres, cifras, fechas, precios ni datos sin una
  fuente.** Anota la fuente en un comentario junto al dato. Si falta un dato,
  deja un espacio vacío que la página oculte o explique, nunca una suposición
  verosímil. Los artículos de prensa envejecen: no saques de ellos los
  nombres de los funcionarios actuales.
- **Borra el texto que no se quiere; no lo escondas.** Un relleno escrito por
  IA se filtraba al importarlo en vez de eliminarlo, así que seguía en el
  código y bastaba cambiarle una palabra para que volviera a aparecer.
- **Revisa las imágenes recibidas en busca de marcas de IA** (busca en los
  bytes del archivo `c2pa`, `trainedAlgorithmicMedia`, `openai`) y dile al
  usuario lo que encuentres; el usuario decide si se usan. Nunca recortes las
  franjas de texto que vienen dentro de las imágenes que entregó el usuario.
- **Un solo nombre para cada cosa** en todo un sitio o aplicación.

## Producción y despliegue

- **Averigua si la carpeta está en vivo.** Si un vigilante de archivos o una
  sincronización copia a producción lo que se guarda, una edición a medias
  puede publicarse: termina cada cambio y ejecuta las pruebas antes de
  seguir.
- **Nunca escribas directamente en producción** (servidores, carpetas
  compartidas, bases de datos). Usa el procedimiento de despliegue del
  proyecto; si producción está rota, avísale al usuario.
- **El código y su migración de base de datos se publican juntos.** Publicar
  código antes de su migración provocó cientos de errores en producción.
  Cuando añadas una migración, dilo y asegúrate de que se aplique.
- **Después de un comando rechazado o interrumpido, revisa el estado real**
  (`git status`, los archivos) antes de informar qué cambió. Un comando
  reportado como "no ejecutado" había borrado archivos (2026-11-02).
- **Una página de error que dice "el equipo ha sido notificado" debe decir
  la verdad:** comprueba que los correos o alertas de error estén
  configurados.
- **Las comprobaciones automáticas contra un sitio deben identificarse** (con
  una cabecera que las estadísticas ignoren), o cuentan como visitas y
  distorsionan las estadísticas (2026-11-13). Revisa qué registra un sitio
  antes de recorrerlo.

## Edición de código

- **Al insertar código encima de una función, ponlo encima de sus
  decoradores.** Una función auxiliar insertada entre un decorador de caché y
  su vista rompió una página en vivo (2026-11-04).
- **Busca un componente existente antes de escribir CSS o plantillas
  nuevas;** no añadas reglas que solo deshacen reglas anteriores. Si hay
  plantillas base duplicadas, un cambio debe hacerse en cada copia.

## Verificación

- **Date una forma de comprobar tu trabajo y muestra la evidencia:** ejecuta
  las pruebas y, en trabajo de interfaz, mira la página en un navegador real
  (capturas, clics, medidas), no solo el código. Basta un navegador sin
  ventana (Edge o Chrome con `--headless --screenshot`).
- **Reinicia los servidores de desarrollo que no se recargan solos** después
  de cambiar el código, o las comprobaciones mostrarán el código viejo.
- **Revisa lo que verá el usuario:** cuadrículas con la misma imagen dos
  veces, etiquetas sin contexto, textos cuyo color final viene de una regla
  posterior, menús que se desbordan en anchos intermedios (alrededor de
  1400–1500px), el peso de la página después de añadir imágenes.

## Windows, OneDrive y herramientas del agente

- Los heredocs de Bash que contienen un apóstrofo fallan en la herramienta de
  terminal del agente; escribe ese contenido con una herramienta de escritura
  de archivos.
- OneDrive puede bloquear archivos a mitad de una compilación (por ejemplo
  `staticfiles/` durante `collectstatic`); vuelve a intentarlo.
- Los vigilantes de archivos en carpetas de OneDrive pueden no ver cambios o
  reiniciarse sin parar; toca un archivo modificado para que reaccionen.
- El clasificador de seguridad del agente puede bloquear subir código de
  trabajo a una cuenta personal de GitHub; el push lo hace el usuario.
- PowerShell no distingue mayúsculas en los nombres: una función auxiliar
  llamada `Git` se llama a sí misma en vez de a `git.exe` (recursión
  infinita). Nombra las funciones `Invoke-Git` y llama a `git.exe`
  explícitamente (2026-11-13).
- Windows PowerShell 5.1 convierte la salida de error de un programa externo
  en errores que detienen el script con `$ErrorActionPreference = "Stop"`; en
  scripts que ejecutan git o Python, usa "Continue" y revisa
  `$LASTEXITCODE`. Mantén los `.ps1` en ASCII (5.1 lee mal el UTF-8 sin BOM).
- Nombres de archivo con caracteres no ASCII: git los pone entre comillas y
  los escapa en octal salvo con `-c core.quotepath=false` (y la consola en
  UTF-8), y el `tar` de Windows los descomprime dañados; usa
  `git archive --format=zip` + .NET `ZipFile.ExtractToDirectory(..., UTF8)`.
  Un despliegue se detuvo en un archivo llamado "Formulario de Evaluación"
  (2026-11-13).
- **Un ensayo (dry run) debe ejecutar todos los pasos que pueda sin riesgo**,
  no solo las comprobaciones: el ensayo de un despliegue se saltaba el paso de
  copia y no detectó un error de rutas que solo apareció en el despliegue
  real. Verifica también lo que reciben los pasos que hacen cambios.
- WinRM (`Invoke-Command`) en un dominio necesita el nombre del servidor, no
  su IP (Kerberos); con la IP exige TrustedHosts y credenciales explícitas.
- Python 3.13+ rechaza algunos certificados de CA internos ("CA cert does not
  include key usage extension") que los navegadores aceptan: desactiva solo
  `ssl.VERIFY_X509_STRICT`; nunca desactives la verificación.
