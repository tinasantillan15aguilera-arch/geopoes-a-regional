/* 
   Registro de uso de IA: Corrección en la gestión de archivos adjuntos. 
   Se implementa la lectura mediante FileReader tanto para imágenes como para documentos (PDF/Word), 
   permitiendo su descarga y visualización real desde las tarjetas, y se añade lógica para limpiar 
   la selección de archivos en el formulario.
*/

// ==========================================
// 1. ARRAY INICIAL CON DATOS FICTICIOS DE EJEMPLO
// ==========================================
let mitos = [
    {
        id: "1",
        titulo: "La Luz Mala del Cerro",
        region: "Norte",
        autorRecopilador: "Mateo Gómez",
        categoria: "Mito",
        imagen: "",
        documentoNombre: "",
        documentoUrl: "",
        textoRelato: "Dicen los paisanos que en las noches de luna llena, una pequeña luz brillante aparece flotando a poca altura sobre los cerros. Si te acercas con respeto, se aleja despacio; pero si le faltas el respeto, te persigue hasta asustarte."
    },
    {
        id: "2",
        titulo: "El Silbido del Pombero",
        region: "Litoral",
        autorRecopilador: "Sofía Benítez",
        categoria: "Leyenda",
        imagen: "",
        documentoNombre: "",
        documentoUrl: "",
        textoRelato: "En las siestas pesadas del monte, a veces se escucha un silbido agudo y penetrante. Cuentan los abuelos que es el duende del bosque avisando que anda cerca, y que no hay que dejar tabaco o miel afuera si no querés enfocar su atención."
    },
    {
        id: "3",
        titulo: "Canto al Viento Patagónico",
        region: "Patagonia",
        autorRecopilador: "Eusebio Galeano",
        categoria: "Poema",
        imagen: "",
        documentoNombre: "",
        documentoUrl: "",
        textoRelato: "El viento baja rugiendo por la barda, / peinando coirones de oro y de sal. / Trae en sus alas la vieja memoria / de un sur profundo que no ha de callar."
    }
];

// Variable de control: si es null, estamos creando un registro nuevo; si tiene un ID, estamos editando
let idEditando = null;

// ==========================================
// 2. FUNCIONES DE PERSISTENCIA (LOCALSTORAGE)
// ==========================================

function guardarDatos() {
    const mitosEnJson = JSON.stringify(mitos);
    localStorage.setItem("mitos-datos", mitosEnJson);
}

function cargarDatos() {
    const datosGuardados = localStorage.getItem("mitos-datos");

    if (datosGuardados !== null) {
        mitos = JSON.parse(datosGuardados);
    } else {
        guardarDatos();
    }
}

// ==========================================
// 3. FUNCIONES DE UTILIDAD Y NORMALIZACIÓN
// ==========================================

function normalizarTexto(texto) {
    if (!texto) return "";
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ==========================================
// 4. FUNCIONES DE RENDERIZADO (MOSTRAR EN PANTALLA)
// ==========================================

/**
 * Dibuja las tarjetas de registros en el contenedor HTML. 
 * Muestra la imagen, la categoría y un enlace funcional de descarga para el documento adjunto.
 */
function mostrarMitos(listaAMostrar = mitos) {
    const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
    contenedorTarjetas.innerHTML = "";

    if (listaAMostrar.length === 0) {
        contenedorTarjetas.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--color-texto-secundario);">
                <p style="font-size: 1.1rem;">🔍 No se encontraron registros con esa búsqueda o categoría.</p>
            </div>
        `;
        return;
    }

    listaAMostrar.forEach(function(mito) {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-mito");

        // Renderizado de la imagen si está presente
        let htmlImagen = "";
        if (mito.imagen && mito.imagen.trim() !== "") {
            htmlImagen = `
                <div style="margin-bottom: 1rem; overflow: hidden; border-radius: 6px; border: 1px solid #E2D9CE;">
                    <img src="${mito.imagen}" alt="Ilustración de ${mito.titulo}" style="width: 100%; height: 180px; object-fit: cover; display: block;" onerror="this.style.display='none'">
                </div>
            `;
        }

        // Renderizado del enlace funcional de descarga para el documento adjunto
        let htmlDocumento = "";
        if (mito.documentoNombre && mito.documentoUrl) {
            htmlDocumento = `
                <div style="margin-top: 0.8rem; padding: 0.6rem 0.8rem; background-color: #F4EFE6; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem;">
                    <span>📎 <strong>Documento:</strong> ${mito.documentoNombre}</span>
                    <a href="${mito.documentoUrl}" download="${mito.documentoNombre}" style="background-color: var(--color-base-monte); color: white; padding: 0.3rem 0.7rem; border-radius: 4px; text-decoration: none; font-size: 0.85rem; font-weight: 600;">
                        📥 Descargar
                    </a>
                </div>
            `;
        }

        let colorFondoEtiqueta = "#1B3B2B";
        if (mito.categoria === "Leyenda") colorFondoEtiqueta = "#8B5A2B";
        if (mito.categoria === "Poema") colorFondoEtiqueta = "#7B241C";
        if (mito.categoria === "Copla") colorFondoEtiqueta = "#D4AC0D";

        tarjeta.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h3>${mito.titulo}</h3>
                <span style="background-color: ${colorFondoEtiqueta}; color: #FFFFFF; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-family: 'Cinzel', serif; font-weight: 700;">${mito.categoria}</span>
            </div>
            
            ${htmlImagen}

            <p><strong>Región:</strong> ${mito.region}</p>
            <p><strong>Autor / Recopilador:</strong> ${mito.autorRecopilador}</p>
            <p>${mito.textoRelato}</p>

            ${htmlDocumento}
            
            <div class="acciones-tarjeta" style="margin-top: 1.25rem; display: flex; gap: 0.5rem;">
                <button type="button" class="btn-editar" onclick="prepararEdicion('${mito.id}')">✏️ Editar</button>
                <button type="button" class="btn-borrar" onclick="borrarMito('${mito.id}')" style="background-color: #C0392B;">🗑️ Borrar</button>
            </div>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });
}

// ==========================================
// 5. FUNCIONES AUXILIARES DE VALIDACIÓN VISUAL
// ==========================================

function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    const contenedorPadre = elemento.parentElement;
    
    const spanError = document.createElement("span");
    spanError.className = "mensaje-error";
    spanError.style.color = "#C0392B";
    spanError.style.fontSize = "0.85rem";
    spanError.style.marginTop = "0.25rem";
    spanError.style.display = "block";
    spanError.textContent = mensaje;

    contenedorPadre.appendChild(spanError);
}

function limpiarErrores() {
    const errores = document.querySelectorAll(".mensaje-error");
    errores.forEach(function(error) {
        error.remove();
    });
}

// ==========================================
// 6. MANEJO DE FORMULARIO, ARCHIVOS Y FILTROS
// ==========================================

const formularioRelato = document.getElementById("formulario-relato");
const botonGuardarRelato = document.getElementById("boton-guardar-relato");
const buscadorGeneral = document.getElementById("buscador-general");
const filtroCategoria = document.getElementById("filtro-categoria");
const botonExportar = document.getElementById("boton-exportar");
const botonImportar = document.getElementById("boton-importar");
const inputArchivoImportar = document.getElementById("input-archivo-importar");

// Referencias a los inputs de archivo y sus nuevos botones de quitar
const inputImagen = document.getElementById("input-imagen");
const btnQuitarImagen = document.getElementById("btn-quitar-imagen");
const inputDocumento = document.getElementById("input-documento");
const btnQuitarDocumento = document.getElementById("btn-quitar-documento");

// Mostrar u ocultar botón de quitar imagen según si hay archivo seleccionado
inputImagen.addEventListener("change", function() {
    if (inputImagen.files.length > 0) {
        btnQuitarImagen.style.display = "block";
    } else {
        btnQuitarImagen.style.display = "none";
    }
});

btnQuitarImagen.addEventListener("click", function() {
    inputImagen.value = ""; // Limpia el input file
    btnQuitarImagen.style.display = "none";
});

// Mostrar u ocultar botón de quitar documento según si hay archivo seleccionado
inputDocumento.addEventListener("change", function() {
    if (inputDocumento.files.length > 0) {
        btnQuitarDocumento.style.display = "block";
    } else {
        btnQuitarDocumento.style.display = "none";
    }
});

btnQuitarDocumento.addEventListener("click", function() {
    inputDocumento.value = ""; // Limpia el input file
    btnQuitarDocumento.style.display = "none";
});

function filtrarYMostrarMitos() {
    const textoBusqueda = normalizarTexto(buscadorGeneral.value);
    const categoriaSeleccionada = filtroCategoria.value;

    const mitosFiltrados = mitos.filter(function(mito) {
        const tituloNormalizado = normalizarTexto(mito.titulo);
        const regionNormalizada = normalizarTexto(mito.region);
        const autorNormalizado = normalizarTexto(mito.autorRecopilador);

        const coincideTexto = tituloNormalizado.includes(textoBusqueda) || 
                              regionNormalizada.includes(textoBusqueda) || 
                              autorNormalizado.includes(textoBusqueda);
                              
        const coincideCategoria = categoriaSeleccionada === "todos" || mito.categoria === categoriaSeleccionada;

        return coincideTexto && coincideCategoria;
    });

    mostrarMitos(mitosFiltrados);
}

buscadorGeneral.addEventListener("input", filtrarYMostrarMitos);
filtroCategoria.addEventListener("change", filtrarYMostrarMitos);

// --- EXPORTAR E IMPORTAR DATOS ---
function exportarDatos() {
    const jsonLegible = JSON.stringify(mitos, null, 2);
    const blob = new Blob([jsonLegible], { type: "application/json" });
    const urlTemporal = URL.createObjectURL(blob);

    const enlaceDescarga = document.createElement("a");
    enlaceDescarga.href = urlTemporal;
    enlaceDescarga.download = "recorrido-geopoetico.json";
    
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    
    document.body.removeChild(enlaceDescarga);
    URL.revokeObjectURL(urlTemporal);
}

botonExportar.addEventListener("click", exportarDatos);

botonImportar.addEventListener("click", function() {
    inputArchivoImportar.click();
});

inputArchivoImportar.addEventListener("change", function(evento) {
    const archivoSeleccionado = evento.target.files[0];
    if (!archivoSeleccionado) return;

    const lector = new FileReader();
    lector.onload = function(e) {
        try {
            const contenidoTexto = e.target.result;
            const datosParseados = JSON.parse(contenidoTexto);

            if (!Array.isArray(datosParseados)) {
                alert("Error: El archivo JSON no tiene un formato válido.");
                return;
            }

            const confirmacion = confirm("¿Estás seguro de que querés reemplazar los registros actuales con los del archivo importado?");
            
            if (confirmacion) {
                mitos = datosParseados;
                guardarDatos();
                filtrarYMostrarMitos();
                buscadorGeneral.value = "";
                filtroCategoria.value = "todos";
                alert("¡Datos importados correctamente!");
            }
        } catch (error) {
            alert("Error: El archivo está corrupto o mal formado.");
        } finally {
            inputArchivoImportar.value = "";
        }
    };
    lector.readAsText(archivoSeleccionado);
});

// Envío del formulario procesando imagen y documento con FileReader para permitir descarga real
formularioRelato.addEventListener("submit", function(evento) {
    evento.preventDefault();
    limpiarErrores();

    const tituloIngresado = document.getElementById("input-titulo").value.trim();
    const regionIngresada = document.getElementById("select-region").value;
    const autorIngresado = document.getElementById("input-autor").value.trim();
    const categoriaIngresada = document.getElementById("select-categoria").value;
    const textoIngresado = document.getElementById("textarea-relato").value.trim();

    const archivoImagen = inputImagen.files[0];
    const archivoDocumento = inputDocumento.files[0];

    let hayErrores = false;

    if (tituloIngresado === "") {
        mostrarError("input-titulo", "El título es obligatorio.");
        hayErrores = true;
    } else {
        const tituloMinuscula = tituloIngresado.toLowerCase();
        const mitoExistente = mitos.find(function(mito) {
            if (idEditando !== null && mito.id === idEditando) {
                return false;
            }
            return mito.titulo.trim().toLowerCase() === tituloMinuscula;
        });

        if (mitoExistente) {
            mostrarError("input-titulo", "Ya existe otro registro con exactamente el mismo título.");
            hayErrores = true;
        }
    }

    if (regionIngresada === "") {
        mostrarError("select-region", "Debe seleccionar una región obligatoriamente.");
        hayErrores = true;
    }

    if (categoriaIngresada === "") {
        mostrarError("select-categoria", "Debe seleccionar una categoría obligatoriamente.");
        hayErrores = true;
    }

    if (textoIngresado.length < 20) {
        mostrarError("textarea-relato", "El texto debe tener al menos 20 caracteres (actualmente tiene " + textoIngresado.length + ").");
        hayErrores = true;
    }

    if (hayErrores) {
        return;
    }

    /**
     * Función que procesa el guardado final una vez leídos los archivos que haya adjuntado el usuario.
     */
    function guardarRegistroFinal(imagenBase64, docNombre, docUrl) {
        let imagenFinal = imagenBase64;
        let docNombreFinal = docNombre;
        let docUrlFinal = docUrl;

        // Si estamos editando y no se adjuntó un archivo nuevo, conservamos el anterior
        if (idEditando !== null) {
            const mitoAnterior = mitos.find(m => m.id === idEditando);
            if (mitoAnterior) {
                if (!imagenFinal && archivoImagen === undefined) {
                    imagenFinal = mitoAnterior.imagen;
                }
                if (!docNombreFinal && archivoDocumento === undefined) {
                    docNombreFinal = mitoAnterior.documentoNombre;
                    docUrlFinal = mitoAnterior.documentoUrl;
                }
            }
        }

        if (idEditando === null) {
            const nuevoRegistro = {
                id: Date.now().toString(),
                titulo: tituloIngresado,
                region: regionIngresada,
                autorRecopilador: autorIngresado,
                categoria: categoriaIngresada,
                imagen: imagenFinal || "",
                documentoNombre: docNombreFinal || "",
                documentoUrl: docUrlFinal || "",
                textoRelato: textoIngresado
            };
            mitos.push(nuevoRegistro);
        } else {
            mitos = mitos.map(function(mito) {
                if (mito.id === idEditando) {
                    return {
                        ...mito,
                        titulo: tituloIngresado,
                        region: regionIngresada,
                        autorRecopilador: autorIngresado,
                        categoria: categoriaIngresada,
                        imagen: imagenFinal || "",
                        documentoNombre: docNombreFinal || "",
                        documentoUrl: docUrlFinal || "",
                        textoRelato: textoIngresado
                    };
                }
                return mito;
            });

            idEditando = null;
            botonGuardarRelato.textContent = "Guardar Registro";
        }

        guardarDatos();
        filtrarYMostrarMitos();
        formularioRelato.reset();
        
        // Ocultar botones de quitar archivo tras guardar
        btnQuitarImagen.style.display = "none";
        btnQuitarDocumento.style.display = "none";
    }

    // Lectura de archivos con FileReader de manera sincronizada si existen
    let imagenLeida = null;
    let docNombreLeido = "";
    let docUrlLeido = "";
    let tareasPendientes = 0;

    function chequearFinLectura() {
        if (tareasPendientes === 0) {
            guardarRegistroFinal(imagenLeida, docNombreLeido, docUrlLeido);
        }
    }

    if (archivoImagen) {
        tareasPendientes++;
        const lectorImg = new FileReader();
        lectorImg.onload = function(e) {
            imagenLeida = e.target.result;
            tareasPendientes--;
            chequearFinLectura();
        };
        lectorImg.readAsDataURL(archivoImagen);
    }

    if (archivoDocumento) {
        tareasPendientes++;
        docNombreLeido = archivoDocumento.name;
        const lectorDoc = new FileReader();
        lectorDoc.onload = function(e) {
            docUrlLeido = e.target.result; // Guardamos la URL de datos para poder descargarla
            tareasPendientes--;
            chequearFinLectura();
        };
        lectorDoc.readAsDataURL(archivoDocumento);
    }

    if (tareasPendientes === 0) {
        guardarRegistroFinal(null, "", "");
    }
});

// ==========================================
// 7. FUNCIONES DE EDICIÓN Y BORRADO
// ==========================================

function prepararEdicion(idMito) {
    limpiarErrores();

    const mitoAEditar = mitos.find(function(mito) {
        return mito.id === idMito;
    });

    if (mitoAEditar) {
        document.getElementById("input-titulo").value = mitoAEditar.titulo;
        document.getElementById("select-region").value = mitoAEditar.region;
        document.getElementById("input-autor").value = mitoAEditar.autorRecopilador;
        document.getElementById("select-categoria").value = mitoAEditar.categoria;
        document.getElementById("textarea-relato").value = mitoAEditar.textoRelato;
        
        // Limpiamos los inputs file
        inputImagen.value = "";
        inputDocumento.value = "";
        btnQuitarImagen.style.display = "none";
        btnQuitarDocumento.style.display = "none";

        idEditando = idMito;
        botonGuardarRelato.textContent = "Actualizar Registro";

        document.getElementById("seccion-aportar").scrollIntoView({ behavior: 'smooth' });
    }
}

function borrarMito(idMito) {
    const confirmacion = confirm("¿Estás seguro de que querés eliminar este registro?");

    if (confirmacion) {
        mitos = mitos.filter(function(mito) {
            return mito.id !== idMito;
        });

        if (idEditando === idMito) {
            idEditando = null;
            botonGuardarRelato.textContent = "Guardar Registro";
            formularioRelato.reset();
            limpiarErrores();
            btnQuitarImagen.style.display = "none";
            btnQuitarDocumento.style.display = "none";
        }

        guardarDatos();
        filtrarYMostrarMitos();
    }
}

// ==========================================
// 8. INICIALIZACIÓN DE LA APLICACIÓN Y REGISTRO DE SERVICE WORKER (Paso 4)
// ==========================================
cargarDatos();
filtrarYMostrarMitos();

// Registro del Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("./sw.js")
            .then(function(registro) {
                console.log("Service Worker registrado correctamente con éxito:", registro.scope);
            })
            .catch(function(error) {
                console.log("Fallo al registrar el Service Worker:", error);
            });
    });
}