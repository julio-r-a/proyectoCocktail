let cocteles = [];

const formulario = document.getElementById('formulario-busqueda');
const resultado = document.getElementById('resultado');
const nombreCoctel = document.getElementById('nombre-coctel');
const imagenCoctel = document.getElementById('imagen-coctel');
const ingredientesLista = document.getElementById('ingredientes');
const instrucciones = document.getElementById('instrucciones');
const listaHistorial = document.getElementById('lista-historial');

const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
const overlay = document.getElementById('overlay');

// Cargar los cócteles peruanos del JSON local
fetch('json/cocteles-peruanos.json')
  .then(res => res.json())
  .then(data => {
    cocteles = data;
    cargarHistorial();
  });

formulario.addEventListener('submit', e => {
  e.preventDefault();
  const termino = document.getElementById('busqueda').value.trim().toLowerCase();
  buscarYMostrarCoctel(termino);
  ocultarSidebarEnMovil();
});

btnToggleSidebar.addEventListener('click', () => {
  if (sidebar.classList.contains('visible')) {
    ocultarSidebarEnMovil();
  } else {
    mostrarSidebarEnMovil();
  }
});

overlay.addEventListener('click', () => {
  ocultarSidebarEnMovil();
});

function buscarYMostrarCoctel(nombre) {
  const coctel = cocteles.find(c => c.nombre.toLowerCase() === nombre);

  if (!coctel) {
    resultado.classList.add('d-none');
    alert('Cóctel peruano no encontrado.');
    return;
  }

  mostrarCoctel(coctel);
  guardarEnHistorial(coctel.nombre);
}

function mostrarCoctel(coctel) {
  nombreCoctel.textContent = coctel.nombre;
  imagenCoctel.src = coctel.imagen;
  imagenCoctel.alt = `Imagen de ${coctel.nombre}`;
  instrucciones.textContent = coctel.instrucciones;

  ingredientesLista.innerHTML = '';
  coctel.ingredientes.forEach(ingrediente => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.textContent = ingrediente;
    ingredientesLista.appendChild(item);
  });

  resultado.classList.remove('d-none');
}

function guardarEnHistorial(nombre) {
  let historial = JSON.parse(localStorage.getItem('historialCocteles')) || [];

  // Evitar duplicados
  historial = historial.filter(item => item.toLowerCase() !== nombre.toLowerCase());

  // Agregar al inicio
  historial.unshift(nombre);

  // Limitar historial a 10 elementos
  if (historial.length > 10) historial = historial.slice(0, 10);

  localStorage.setItem('historialCocteles', JSON.stringify(historial));
  cargarHistorial();
}

function cargarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historialCocteles')) || [];

  listaHistorial.innerHTML = '';

  if (historial.length === 0) {
    listaHistorial.innerHTML = '<li class="list-group-item">No hay búsquedas recientes.</li>';
    return;
  }

  historial.forEach(nombre => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'list-group-item-action');
    li.textContent = nombre;
    li.addEventListener('click', () => {
      buscarYMostrarCoctel(nombre.toLowerCase());
      ocultarSidebarEnMovil();
    });
    listaHistorial.appendChild(li);
  });
}

function mostrarSidebarEnMovil() {
  sidebar.classList.add('visible');
  overlay.classList.add('visible');
}

function ocultarSidebarEnMovil() {
  sidebar.classList.remove('visible');
  overlay.classList.remove('visible');
}
