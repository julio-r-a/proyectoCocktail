let cocteles = [];

const formulario = document.getElementById('formulario-busqueda');
const resultado = document.getElementById('resultado');
const nombreCoctel = document.getElementById('nombre-coctel');
const imagenCoctel = document.getElementById('imagen-coctel');
const ingredientesLista = document.getElementById('ingredientes');
const instrucciones = document.getElementById('instrucciones');
const listaHistorialDesktop = document.getElementById('lista-historial');
const listaHistorialMovil = document.getElementById('lista-historial-movil');
const listaCoctelesDesktop = document.getElementById('lista-cocteles');
const listaCoctelesMovil = document.getElementById('lista-cocteles-movil');

fetch('json/cocteles-peruanos.json')
  .then(res => res.json())
  .then(data => {
    cocteles = data;
    cargarHistorial();
    mostrarListaDeCocteles();
  });

formulario.addEventListener('submit', e => {
  e.preventDefault();
  const termino = document.getElementById('busqueda').value.trim().toLowerCase();
  buscarYMostrarCoctel(termino);
  cerrarOffcanvas();
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
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = ingrediente;
    ingredientesLista.appendChild(li);
  });

  resultado.classList.remove('d-none');
}

function guardarEnHistorial(nombre) {
  let historial = JSON.parse(localStorage.getItem('historialCocteles')) || [];

  historial = historial.filter(item => item.toLowerCase() !== nombre.toLowerCase());
  historial.unshift(nombre);
  if (historial.length > 3) historial = historial.slice(0, 3);

  localStorage.setItem('historialCocteles', JSON.stringify(historial));
  cargarHistorial();
}

function cargarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historialCocteles')) || [];

  listaHistorialDesktop.innerHTML = '';
  listaHistorialMovil.innerHTML = '';

  if (historial.length === 0) {
    const empty = '<li class="list-group-item">No hay búsquedas recientes.</li>';
    listaHistorialDesktop.innerHTML = empty;
    listaHistorialMovil.innerHTML = empty;
    return;
  }

  historial.forEach(nombre => {
    const crearItem = (esMovil = false) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const span = document.createElement('span');
      span.textContent = nombre;
      span.classList.add('flex-grow-1', 'me-2');
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => {
        buscarYMostrarCoctel(nombre.toLowerCase());
        if (esMovil) cerrarOffcanvas();
      });

      const btnEliminar = document.createElement('button');
      btnEliminar.className = 'btn btn-sm btn-outline-danger';
      btnEliminar.innerHTML = '&times;';
      btnEliminar.setAttribute('aria-label', 'Eliminar del historial');
      btnEliminar.addEventListener('click', (e) => {
        e.stopPropagation();
        eliminarDelHistorial(nombre);
      });

      li.appendChild(span);
      li.appendChild(btnEliminar);
      return li;
    };

    listaHistorialDesktop.appendChild(crearItem(false));
    listaHistorialMovil.appendChild(crearItem(true));
  });
}

function eliminarDelHistorial(nombre) {
  let historial = JSON.parse(localStorage.getItem('historialCocteles')) || [];
  historial = historial.filter(item => item.toLowerCase() !== nombre.toLowerCase());
  localStorage.setItem('historialCocteles', JSON.stringify(historial));
  cargarHistorial();
}

function cerrarOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasHistorial');
  const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
  if (bsOffcanvas) bsOffcanvas.hide();
}

function mostrarListaDeCocteles() {
  if (!listaCoctelesDesktop || !listaCoctelesMovil) return;

  listaCoctelesDesktop.innerHTML = '';
  listaCoctelesMovil.innerHTML = '';

  cocteles
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .forEach(coctel => {
      const btnDesktop = document.createElement('button');
      btnDesktop.className = 'list-group-item list-group-item-action';
      btnDesktop.textContent = coctel.nombre;
      btnDesktop.addEventListener('click', () => {
        buscarYMostrarCoctel(coctel.nombre.toLowerCase());
        cerrarOffcanvas();
      });

      const btnMovil = btnDesktop.cloneNode(true);
      btnMovil.addEventListener('click', () => {
        buscarYMostrarCoctel(coctel.nombre.toLowerCase());
        cerrarOffcanvas();
      });

      listaCoctelesDesktop.appendChild(btnDesktop);
      listaCoctelesMovil.appendChild(btnMovil);
    });
}
