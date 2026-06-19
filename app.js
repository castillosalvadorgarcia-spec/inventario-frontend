// ⚠️ IMPORTANTE: Conserva la URL de tu servicio web en Render
const API_URL = "https://inventario-backend-y16k.onrender.com/productos";

// Variables globales para controlar el estado del formulario de edición
let modoEdicion = false;
let idProductoAEditar = null;

// READ: Función para consultar los datos guardados en MongoDB Atlas y dibujarlos en la tabla
async function obtenerProductos() {
  try {
    const res = await fetch(API_URL);
    const datos = await res.json();
    
    const tabla = document.getElementById("tabla");
    tabla.innerHTML = ""; // Limpiar tabla antes de rellenar
    
    datos.forEach(prod => {
      tabla.innerHTML += `
        <tr>
          <td>${prod.nombre}</td>
          <td>$${prod.precio}</td>
          <td>${prod.existencia} pzas</td>
          <td>
            <button onclick="prepararEdicion('${prod._id}', '${prod.nombre}', ${prod.precio}, ${prod.existencia})" style="background-color: #f39c12; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-weight: bold;">
              ✏️ Editar
            </button>
            
            <button onclick="eliminarProducto('${prod._id}')" style="background-color: #e74c3c; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">
              🗑️ Borrar
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

// Función intermedia para colocar los datos viejos en los inputs y activar modoEdicion
function prepararEdicion(id, nombre, precio, existencia) {
  document.getElementById("nombre").value = nombre;
  document.getElementById("precio").value = precio;
  document.getElementById("existencia").value = existencia;
  
  // Cambiar visualmente el botón del formulario para alertar al usuario
  const botonForm = document.querySelector("#formProducto button");
  if (botonForm) botonForm.innerText = "💾 Actualizar Producto";
  
  modoEdicion = true;
  idProductoAEditar = id;
}

// CREATE / UPDATE: Función para enviar un nuevo registro o guardar cambios
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Crear el objeto con los datos procesados del formulario
  const datosObj = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  try {
    let res;

    if (modoEdicion) {
      // Si estamos en modo edición, enviamos una petición PUT hacia el ID específico
      res = await fetch(`${API_URL}/${idProductoAEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosObj)
      });

      // Resetear banderas de edición
      modoEdicion = false;
      idProductoAEditar = null;
      const botonForm = document.querySelector("#formProducto button");
      if (botonForm) botonForm.innerText = "Agregar Producto";

    } else {
      // Si no estamos editando, enviamos una petición POST normal de creación
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosObj)
      });
    }

    if (res.ok) {
      alert(modoEdicion ? "¡Cambios guardados con éxito!" : "¡Guardado con éxito en MongoDB Atlas!");
      document.getElementById("formProducto").reset(); // Limpiar formulario
      obtenerProductos(); // Recarga la tabla de manera dinámica
    } else {
      console.error("Hubo un problema al procesar el producto.");
    }
  } catch (err) {
    console.error("Error al enviar datos:", err);
  }
});

// DELETE: Función para remover un producto por completo
async function eliminarProducto(id) {
  const confirmar = confirm("¿Estás seguro de que deseas eliminar este producto del inventario?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      obtenerProductos(); // Recargar tabla automáticamente
    } else {
      console.error("No se pudo eliminar el producto.");
    }
  } catch (err) {
    console.error("Error al intentar eliminar:", err);
  }
}

// Cargar la base de datos inmediatamente al abrir la página
obtenerProductos();