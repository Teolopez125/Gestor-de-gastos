class Gasto {

    constructor(descripcion, monto, categoria, fecha) {
        this.id = Date.now();
        this.descripcion = descripcion;
        this.monto = Number(monto);
        this.categoria = categoria;
        this.fecha = fecha;
    }
}


let gastos = cargarGastos();


// ELEMENTOS DEL DOM

const formGasto = document.querySelector("#formGasto");
const listaGastos = document.querySelector("#listaGastos");
const mensajeVacio = document.querySelector("#mensajeVacio");

const totalGastos = document.querySelector("#totalGastos");
const cantidadGastos = document.querySelector("#cantidadGastos");

const filtroCategoria = document.querySelector("#filtroCategoria");


// EVENTOS

formGasto.addEventListener("submit", agregarGasto);

filtroCategoria.addEventListener("change", mostrarGastos);


// AGREGAR GASTO

function agregarGasto(event) {

    event.preventDefault();

    const descripcion = document.querySelector("#descripcion").value;
    const monto = document.querySelector("#monto").value;
    const categoria = document.querySelector("#categoria").value;
    const fecha = document.querySelector("#fecha").value;

    const nuevoGasto = new Gasto(
        descripcion,
        monto,
        categoria,
        fecha
    );

    gastos.push(nuevoGasto);

    guardarGastos();

    formGasto.reset();

    mostrarGastos();
}


// MOSTRAR GASTOS

function mostrarGastos() {

    listaGastos.innerHTML = "";

    const categoriaSeleccionada = filtroCategoria.value;

    let gastosFiltrados = gastos;

    if (categoriaSeleccionada !== "Todos") {

        gastosFiltrados = gastos.filter(function(gasto) {
            return gasto.categoria === categoriaSeleccionada;
        });

    }


    if (gastosFiltrados.length === 0) {

        mensajeVacio.style.display = "block";

    } else {

        mensajeVacio.style.display = "none";

    }


    gastosFiltrados.forEach(function(gasto) {

        const divGasto = document.createElement("div");

        divGasto.classList.add("expense");

        divGasto.innerHTML = `
            <div class="expense-info">

                <h3>${gasto.descripcion}</h3>

                <p>
                    ${gasto.categoria} · ${formatearFecha(gasto.fecha)}
                </p>

            </div>

            <div class="expense-right">

                <span class="expense-amount">
                    $ ${gasto.monto.toLocaleString("es-UY")}
                </span>

                <button
                    class="btn-delete"
                    onclick="eliminarGasto(${gasto.id})"
                >
                    Eliminar
                </button>

            </div>
        `;

        listaGastos.appendChild(divGasto);

    });


    actualizarResumen();
}


// ELIMINAR GASTO

function eliminarGasto(id) {

    gastos = gastos.filter(function(gasto) {
        return gasto.id !== id;
    });

    guardarGastos();

    mostrarGastos();
}


// ACTUALIZAR RESUMEN

function actualizarResumen() {

    let total = 0;

    gastos.forEach(function(gasto) {
        total += gasto.monto;
    });

    totalGastos.textContent =
        "$ " + total.toLocaleString("es-UY");

    cantidadGastos.textContent = gastos.length;
}


// LOCAL STORAGE

function guardarGastos() {

    localStorage.setItem(
        "gastos",
        JSON.stringify(gastos)
    );

}


function cargarGastos() {

    const datos = localStorage.getItem("gastos");

    if (datos === null) {
        return [];
    }

    return JSON.parse(datos);
}


// FORMATEAR FECHA

function formatearFecha(fecha) {

    const partes = fecha.split("-");

    return partes[2] + "/" + partes[1] + "/" + partes[0];

}


// INICIAR

mostrarGastos();