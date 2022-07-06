
let precioTotal = 0;
const iva=0.19;

class NuevoProducto{
    constructor(objetoJSON){
        this.id=objetoJSON.id;
        this.nombre=objetoJSON.nombre;
        this.foto=objetoJSON.foto;
        this.precio=objetoJSON.precio;
        this.cantidad=1;
    }
}


const miCarrito =JSON.parse(localStorage.getItem("miCarrito")) || [];    //operador lógico or, asignación condicional

insertarCarritoStorage();
resultadoTablaTotal();

function insertarCarritoStorage(){
    let precioTotalStorage=sumarTotal(miCarrito);
    console.log("El carrito actualmente contiene: "+miCarrito.length+ " collages. Precio total: "+precioTotalStorage);
    console.log(miCarrito);
    miCarrito.forEach(productoStorage=>{                        //insertamos en el html lo convertido previamente 
        // let nuevoProducto= new NuevoProducto(productoStorage)
        
        document.getElementById("tablaBody").innerHTML+=`
        <tr>
            <td>${productoStorage.id}</td>
            <td>${productoStorage.nombre}</td>
            <td id="cantidad_${productoStorage.id}">${productoStorage.cantidad}</td>
            <td id="precio_${productoStorage.id}">${productoStorage.precio*productoStorage.cantidad}</td>
        </tr>`;
    })
}

//función sumatoria de precios del contenido del carrito
function sumarTotal(carroActual){
    for(const producto of carroActual){
        precioTotal+=producto.precio*producto.cantidad;
        
    }
    return precioTotal;
}
//capturamos el nodo padre de la galería:
let galeriaProductos=document.getElementById("galeriaProductos");

insertarGaleria();

//función que inserta toda la galería de productos desde un archivo .json:
function insertarGaleria(){
    fetch("https://franciscojm13.github.io/proyecto_final_js/js/productos.json")
    .then((resp)=>resp.json())
    .then((data)=>{
        let productosCollage = data.productosCollageJson;

        for (const producto of productosCollage){
            galeriaProductos.innerHTML+=`
            <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3 d-flex">
                <div class="item__galeriaCollage ">
                    <div><a href="#" id="vistaPreviaImg_${producto.id}"><img src=${producto.foto} alt="microbloqueo_${producto.id}"></a></div>
                    <h5 class="text-center my-2">${producto.nombre}</h5>
                    <p class="text-center mb-2"><strong>$ ${producto.precio} CLP</strong></p>
                    <p class="text-center mb-1">ID: ${producto.id} </p>
                    <div class="col text-center">
                        <button id="btn_${producto.id}" class="btn btn-danger btn-sm">Agregar al carrito</button>
                    </div>
                </div>
            </div>`;
        }
    
        //usando sweet alert como vista previa del producto a agregar al carro:
        productosCollage.forEach(producto=>{                
            document.getElementById(`vistaPreviaImg_${producto.id}`).addEventListener('click', function(){
                Swal.fire({
                    title: `${producto.nombre}`,
                    text: 'Collage análogo 13x18 cm impreso en papel Fine Art',
                    imageUrl: `${producto.foto}`,
                    imageWidth: 390,
                    imageHeight: 520,
                    imageAlt: 'Custom image',
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText: '<i class="fa fa-thumbs-up"></i> Agregar al carrito',
                })
                .then((resultado)=>{                  
                    if(resultado.isConfirmed){
                        agregarAlCarro(producto);
                    }
                })

            })
        })
        //asignamos un evento click por cada botón:
        productosCollage.forEach(producto=>{
            document.getElementById(`btn_${producto.id}`).addEventListener('click', function(){ 
                agregarAlCarro(producto);
            })
        });
    })
};

//función que pushea cada producto nuevo al array del carrito:
function agregarAlCarro(productoAgregado){
    //se verifica si actualmente existe el producto en el carro:
    let verificadorDeCantidad=miCarrito.find(producto=>producto.id == productoAgregado.id);
    if(verificadorDeCantidad==undefined){
        let nuevoProducto= new NuevoProducto(productoAgregado);
        miCarrito.push(nuevoProducto);
        precioTotal+=nuevoProducto.precio;
        console.log("Se ha agregado collage "+nuevoProducto.nombre+" al carrito. El carrito actualmente contiene: "+miCarrito.length+ " collages. Precio total: "+precioTotal)
        console.log(miCarrito);
        document.getElementById("tablaBody").innerHTML+=`
            <tr>
                <td>${nuevoProducto.id}</td>
                <td>${nuevoProducto.nombre}</td>
                <td id="cantidad_${nuevoProducto.id}">${nuevoProducto.cantidad}</td>
                <td id="precio_${nuevoProducto.id}">${nuevoProducto.precio}</td>
                <td><button class='btn btn-light' onclick='eliminarProducto(${nuevoProducto.id})'>hola</button>
            </tr>
        `;
        
    } else{
        let posicionEnCarrito=miCarrito.findIndex(producto=>producto.id == productoAgregado.id);
        miCarrito[posicionEnCarrito].cantidad += 1;
        let precioXcantidad=productoAgregado.precio*miCarrito[posicionEnCarrito].cantidad;
        document.getElementById(`cantidad_${productoAgregado.id}`).innerHTML=miCarrito[posicionEnCarrito].cantidad;
        document.getElementById(`precio_${productoAgregado.id}`).innerHTML=precioXcantidad;

    }
    sumarTotal(miCarrito)
    resultadoTablaTotal();
    localStorage.setItem("miCarrito", JSON.stringify(miCarrito));
    Toastify({
        text: "Ha agregado un producto al carrito! :)",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: "background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
        },
        
    }).showToast();
};

//función que imprime los totales de la tabla:
function resultadoTablaTotal(){

    let precioConIva=precioTotal+precioTotal*iva;

    document.getElementById("tablaTotal").innerHTML=`
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Subtotal: $ ${precioTotal} CLP</th>
        </tr>
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">IVA (19%): $ ${precioTotal*iva} CLP</th>
        </tr>
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Total: $ ${precioConIva} CLP</th>
        </tr>`;
}




