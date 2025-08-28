// -------------------------------
// VARIABLES GLOBALES
// -------------------------------
let contador = 0;
let postipSeleccionado = null;
let notaActiva = null;
let textoActivo = null;
let offsetX = 0, offsetY = 0;

// -------------------------------
// FUNCIONES AUXILIARES
// -------------------------------
function wirePostip(postip) {
    postip.addEventListener("click", () => {
        postipSeleccionado = postip;
    });

    postip.addEventListener("mousedown", (e) => {
        notaActiva = postip;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
        if (notaActiva) {
            notaActiva.style.top = (e.clientY - offsetY) + "px";
            notaActiva.style.left = (e.clientX - offsetX) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        notaActiva = null;
    });
}

function wireTexto(texto) {
    texto.addEventListener("click", () => {
        postipSeleccionado = texto;
    });

    texto.addEventListener("mousedown", (e) => {
        textoActivo = texto;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {
        if (textoActivo) {
            textoActivo.style.top = (e.clientY - offsetY) + "px";
            textoActivo.style.left = (e.clientX - offsetX) + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        textoActivo = null;
    });
}

// -------------------------------
// FUNCIONES PRINCIPALES
// -------------------------------

// Agregar Postip
function agregarNota() {
    const tablero = document.getElementById("tablero");
    const postip = document.createElement("div");

    postip.className = "postip";
    postip.innerText = "Escribe tu tarea...";
    postip.contentEditable = true;
    postip.style.position = "absolute";
    postip.style.top = (110 + contador * 30) + "px";
    postip.style.left = (110 + contador * 30) + "px";

    wirePostip(postip);
    tablero.appendChild(postip);
    contador++;
}

// Eliminar seleccionado
function delPostip() {
    if (postipSeleccionado) {
        postipSeleccionado.remove();
        postipSeleccionado = null;
    }
}

// Atajos teclado
document.addEventListener("keydown", (e) => {
    // Eliminar con Delete
    if (e.key === "Delete" && postipSeleccionado) {
        postipSeleccionado.remove();
    }

    // (pendiente: duplicar postip si quieres)
});

// Crear texto
function crearTexto(x, y) {
    const tablero = document.getElementById("tablero");
    const texto = document.createElement("div");

    texto.className = "texto";
    texto.contentEditable = true;
    texto.innerText = "Nuevo título";
    texto.style.position = "absolute";
    texto.style.top = (y - 10) + "px";
    texto.style.left = (x - 10) + "px";

    wireTexto(texto);
    tablero.appendChild(texto);
    texto.focus();
}

// Doble click en tablero = nuevo texto
const tablero = document.getElementById("tablero");
tablero.addEventListener("dblclick", (e) => {
    if (e.target.id === "tablero") {
        crearTexto(e.clientX, e.clientY);
    }
});

// -------------------------------
// GUARDAR Y CARGAR
// -------------------------------
function guardarTablero() {
    const tablero = document.getElementById("tablero");
    const elementos = Array.from(tablero.children)
        .filter(el => el.classList.contains("postip") || el.classList.contains("texto"))
        .map(el => ({
            tipo: el.className,
            contenido: el.innerText,
            top: el.style.top,
            left: el.style.left,
            bg: el.style.background || null
        }));

    localStorage.setItem("miTablero", JSON.stringify(elementos));
    alert("✅ Tablero guardado");
}

function cargarTablero() {
    const tablero = document.getElementById("tablero");
    tablero.querySelectorAll(".postip, .texto").forEach(el => el.remove());

    const data = localStorage.getItem("miTablero");
    if (!data) return;

    const elementos = JSON.parse(data);
    elementos.forEach(item => {
        const div = document.createElement("div");
        div.className = item.tipo;
        div.contentEditable = true;
        div.innerText = item.contenido;
        div.style.position = "absolute";
        div.style.top = item.top;
        div.style.left = item.left;
        if (item.bg) div.style.background = item.bg;

        tablero.appendChild(div);

        // Reconectar eventos
        if (item.tipo === "postip") wirePostip(div);
        else if (item.tipo === "texto") wireTexto(div);
    });
}

// -------------------------------
// OCULTAR MENU
// -------------------------------
const toolbar = document.getElementById("toolbar");
const toggleBtn = document.getElementById("toggleBtn");
const tabHandle = document.getElementById("tabHandle");

toggleBtn.addEventListener("click", () => {
    toolbar.classList.add("hidden");
    tabHandle.style.display = "block"; // mostrar pestañita
});

tabHandle.addEventListener("click", () => {
    toolbar.classList.remove("hidden");
    tabHandle.style.display = "none"; // ocultar pestañita
});
