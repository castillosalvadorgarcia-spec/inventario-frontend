// ⚠️ IMPORTANTE: Reemplaza esta URL por la URL pública que te otorgue Render en el Paso 3, 
// asegurándote de conservar el "/productos" al final.
const API_URL = "https://inventario-backend-y16k.onrender.com/productos";

// Función para consultar los datos guardados en MongoDB Atlas
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
        </tr>
      `;
    });
  } catch (err) {
    console.error("Error al traer datos:", err);
  }
}

// Función para enviar un nuevo registro a través del servidor hacia MongoDB
document.getElementById("formProducto").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Crear el objeto con los datos del formulario
  const nuevoObj = {
    nombre: document.getElementById("nombre").value,
    precio: Number(document.getElementById("precio").value),
    existencia: Number(document.getElementById("existencia").value)
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(nuevoObj)
    });

    if (res.ok) {
      alert("¡Guardado con éxito en MongoDB Atlas!");
      document.getElementById("formProducto").reset(); // Limpiar formulario
      obtenerProductos(); // Recarga la tabla de manera dinámica sin refrescar la página
    } else {
      console.error("Hubo un problema al guardar el producto.");
    }
  } catch (err) {
    console.error("Error al enviar datos:", err);
  }
});

// Cargar la base de datos inmediatamente al abrir la página
obtenerProductos();