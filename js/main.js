//Declaro la funcion mostrarProductos, levanto la lista de productos de Listadodeproductos.json y muestro los productos en DOM

function mostrarProductos(Listadeproductos) {
  //Muestro toda mi lista de productos en DOM
  Listadeproductos.forEach((producto) => {
    contenedor_productos.innerHTML += `
  <div class="card" style="width: 18rem">
    <img src="${producto.img}" class="card-img-top" alt="${producto.alt}" />
    <div class="card-body">
      <h5 class="card-title">${producto.nombre}</h5>
      <p class="card-text">
        $${producto.precio}
      </p>
    <a href="#" class="btn btn-primary" id="producto${producto.id}" >Agregar al carrito</a>
    </div>
  </div>`;
  });
  //Asigno a cada botón un evento de escuchar y lo voy agregando al carrito
  Listadeproductos.forEach((producto) => {
    const producto_a_agregar = document.getElementById(
      `producto${producto.id}`
    );
    producto_a_agregar.addEventListener("click", () => {
      controladorCarrito.anadir(producto);
      controladorCarrito.levantar();
      controladorCarrito.mostrarEnDOM(contenedor_carrito);
      controladorCarrito.mostrarPreciosEnDOM(precio, precio_con_iva);
      Toastify({
        text: "Su producto ha sido añadido",
        gravity: "bottom",
        duration: 1000,
      }).showToast();
    });
  });
}

fetch("./js/listadodeproductos.json")
  .then((res) => res.json())
  .then((data) => mostrarProductos(data));

//Creo controlador de carrito con sus métodos
class CarritoController {
  constructor() {
    this.Listacarrito = [];
    this.localStorageVariable = "listaCarrito";
  }
  //Método para el local storage y vaciar el carrito
  limpiar() {
    localStorage.removeItem(this.localStorageVariable);
    this.Listacarrito = [];
  }
  //Método para obtener información del local storage
  levantar() {
    let obtenerListaJSON = localStorage.getItem(this.localStorageVariable);
    if (obtenerListaJSON) {
      this.Listacarrito = JSON.parse(obtenerListaJSON);
      return true;
    }
    return false;
  }
  //Método para agregar productos al carrito y al local storage
  anadir(producto) {
    this.Listacarrito.push(producto);
    let arrformatoJSON = JSON.stringify(this.Listacarrito);
    localStorage.setItem(this.localStorageVariable, arrformatoJSON);
  }
  //Metodo para mostrar el contenido del carrito en DOM
  mostrarEnDOM(contenedor_carrito) {
    //limpio contenedor
    contenedor_carrito.innerHTML = "";
    //muestro todo
    this.Listacarrito.forEach((producto) => {
      contenedor_carrito.innerHTML += `
      <div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <p class="card-text">$${producto.precio}</p>
            </div>
          </div>
        </div>
      </div>
      `;
    });
  }
  //Método para mostrar el total y el precio+iva en DOM
  mostrarPreciosEnDOM(precio, precio_con_iva) {
    precio.innerHTML = "$" + this.calcularTotal();
    precio_con_iva.innerHTML = "$" + this.calcularPrecioConIva();
  }
  //Metodo que calcula el total de carrito sin IVA
  calcularTotal() {
    return this.Listacarrito.reduce(
      (acumulador, producto) => acumulador + producto.precio,
      0
    );
  }
  //Metodo que calcula el total de carrito con IVA
  calcularPrecioConIva() {
    return this.calcularTotal() * 1.21;
  }
}

//Objeto controlador
const controladorCarrito = new CarritoController();

//Obtener DOM
const contenedor_productos = document.getElementById("contenedor_productos");
const contenedor_carrito = document.getElementById("contenedor_carrito");
const precio = document.getElementById("precio");
const precio_con_iva = document.getElementById("precio_con_iva");

//Verificar storage
const haycarrito = controladorCarrito.levantar();

if (haycarrito) {
  controladorCarrito.mostrarPreciosEnDOM(precio, precio_con_iva);
}

//APP JS

controladorCarrito.mostrarEnDOM(contenedor_carrito);

//Finalizar compra

const finalizar_compra = document.getElementById("finalizar_compra");

finalizar_compra.addEventListener("click", () => {
  if (controladorCarrito.Listacarrito.length > 0) {
    controladorCarrito.limpiar();
    controladorCarrito.mostrarEnDOM(contenedor_carrito);
    controladorCarrito.mostrarPreciosEnDOM(precio, precio_con_iva);
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Su compra se ha realizado con éxito",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "Agrega productos al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
});
