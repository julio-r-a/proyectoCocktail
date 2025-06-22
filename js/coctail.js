let cocteles = [];

const formulario = document.getElementById('formulario-busqueda');
const resultado = document.getElementById('resultado');
const nombreCoctel = document.getElementById('nombre-coctel');
const imagenCoctel = document.getElementById('imagen-coctel');
const ingredientesLista = document.getElementById('ingredientes');
const instrucciones = document.getElementById('instrucciones');
const listaCoctelesDesktop = document.getElementById('lista-cocteles');
const listaCoctelesMovil = document.getElementById('lista-cocteles-movil');

fetch('json/cocteles-peruanos.json')
  .then(res => res.json())
  .then(data => {
    cocteles = data;
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

function cerrarOffcanvas() {
  const offcanvasEl = document.getElementById('offcanvasCocteles');
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
