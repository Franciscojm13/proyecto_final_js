
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
    let precioTotalStorage=sumarTotalStorage(miCarrito);
    console.log("El carrito actualmente contiene los siguientes porductos y su precio total es de "+precioTotalStorage);
    console.log(miCarrito);
    miCarrito.forEach(productoStorage=>{                        //insertamos en el html lo convertido previamente         
        document.getElementById("tablaBody").innerHTML+=`
        <tr id=filaProducto_${productoStorage.id}>
            <td>${productoStorage.id}</td>
            <td>${productoStorage.nombre}</td>
            <td id="cantidad_${productoStorage.id}">${productoStorage.cantidad}</td>
            <td id="precio_${productoStorage.id}">${productoStorage.precio*productoStorage.cantidad}</td>
            <td><button id='quitar_${productoStorage.id}' class='btn btn-light'>🗑️</button></td>
        </tr>`;
    })
    miCarrito.forEach(producto=>{
        document.getElementById(`quitar_${producto.id}`).addEventListener('click', ()=>{ 
            console.log(`Se ha quitado una unidad del producto ${producto.nombre}`);
            producto.cantidad-=1;
            document.getElementById(`cantidad_${producto.id}`).innerHTML=producto.cantidad;
            let precioXcantidad=producto.cantidad*producto.precio;
            document.getElementById(`precio_${producto.id}`).innerHTML=precioXcantidad;
            restarProductoDelTotal(`${producto.id}`);
            
            console.log(precioTotal);   //console de prueba
            resultadoTablaTotal();
            if(producto.cantidad<=0){
                let indice=miCarrito.findIndex(prod=>prod.id==`${producto.id}`);
                miCarrito.splice(indice, 1);
                let filaProductoQuitado=document.getElementById(`filaProducto_${producto.id}`);
                document.getElementById("tablaBody").removeChild(filaProductoQuitado);
                resultadoTablaTotal();
            }
            console.log(miCarrito);
            localStorage.setItem("miCarrito", JSON.stringify(miCarrito));
            
        })
    })
}

//función que resta un producto del precio total:
function restarProductoDelTotal(idProductoQuitar){
    let indice=miCarrito.findIndex(producto=>producto.id==idProductoQuitar)
        precioTotal=precioTotal-miCarrito[indice].precio;
}

//función sumatoria de precios del storage:
function sumarTotalStorage(carroActual){
    for(const producto of carroActual){
        precioTotal=precioTotal+producto.precio*producto.cantidad;
        
    }
    return precioTotal;
}

function sumarProductoAlTotal(miCarrito, idProductoAgregado){
    let indice=miCarrito.findIndex(producto=>producto.id==idProductoAgregado)
    precioTotal=precioTotal+miCarrito[indice].precio;
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
        sumarProductoAlTotal(miCarrito,`${nuevoProducto.id}`)
        console.log("Se ha agregado collage "+nuevoProducto.nombre+" al carrito.");

        document.getElementById("tablaBody").innerHTML+=`
            <tr id=filaProducto_${nuevoProducto.id}>
                <td>${nuevoProducto.id}</td>
                <td>${nuevoProducto.nombre}</td>
                <td id="cantidad_${nuevoProducto.id}">${nuevoProducto.cantidad}</td>
                <td id="precio_${nuevoProducto.id}">${nuevoProducto.precio}</td>
                <td><button id='quitar_${nuevoProducto.id}' class='btn btn-light'>🗑️</button></td>
            </tr>
        `;

        miCarrito.forEach(producto=>{
            document.getElementById(`quitar_${producto.id}`).addEventListener('click', ()=>{ 
                console.log(`Se ha quitado una unidad del producto ${producto.nombre}`);
                producto.cantidad-=1;
                document.getElementById(`cantidad_${producto.id}`).innerHTML=producto.cantidad;
                let precioXcantidad=producto.cantidad*producto.precio;
                document.getElementById(`precio_${producto.id}`).innerHTML=precioXcantidad;
                restarProductoDelTotal(`${producto.id}`);
                console.log(precioTotal);   //console de prueba
                resultadoTablaTotal();
                if(producto.cantidad<=0){
                    let indice=miCarrito.findIndex(prod=>prod.id==`${producto.id}`);
                    miCarrito.splice(indice, 1);
                    let filaProductoQuitado=document.getElementById(`filaProducto_${producto.id}`);
                    document.getElementById("tablaBody").removeChild(filaProductoQuitado);
                    // document.getElementById("tablaTotal").innerHTML=`${resultadoTablaTotal()}`;
                    resultadoTablaTotal();
                }
                console.log(miCarrito);
                localStorage.setItem("miCarrito", JSON.stringify(miCarrito));
                
            })
        })
        
    } else{
        let posicionEnCarrito=miCarrito.findIndex(producto=>producto.id == productoAgregado.id);
        miCarrito[posicionEnCarrito].cantidad += 1;
        sumarProductoAlTotal(miCarrito,`${productoAgregado.id}`)
        console.log(`Se ha agregado collage ${productoAgregado.nombre} al carrito`);
        let precioXcantidad=productoAgregado.precio*miCarrito[posicionEnCarrito].cantidad;
        document.getElementById(`cantidad_${productoAgregado.id}`).innerHTML=miCarrito[posicionEnCarrito].cantidad;
        document.getElementById(`precio_${productoAgregado.id}`).innerHTML=precioXcantidad;
        

    }

    console.log(precioTotal);
    console.log(miCarrito);
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
        </tr>`

    document.getElementById("botonesFinales").innerHTML=`
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">
                <button class="btn btn-success btn-sm" onclick="comprarCarrito()">Comprar carrito</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarCarrito()">Borrar carrito 🗑️</button> 
            </th>
        </tr>`;
}

function comprarCarrito(){
        
        if(precioTotal==0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Primero debes agregar productos al carro antes de proceder',
            })
        }else{
            Swal.fire({
                
                icon: 'success',
                title: '',
                showConfirmButton: false,
                timer: 1000
            })
        }

}

function eliminarCarrito(){
    
        miCarrito.splice(0)
        precioTotal=0;
        resultadoTablaTotal();
        console.log(miCarrito);
        document.getElementById("tablaBody").innerHTML= "";
        localStorage.setItem("miCarrito", JSON.stringify(miCarrito));

        Swal.fire({
            
            icon: 'success',
            title: 'Carrito borrado! 🗑️',
            showConfirmButton: false,
            timer: 1200
        })
}


