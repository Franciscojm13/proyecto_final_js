
let precioTotal = 0;
const iva=0.19;


const miCarrito =JSON.parse(localStorage.getItem("miCarrito")) || [];    //operador lógico or, asignación condicional

insertarCarritoStorage();
resultadoTablaTotal();

function insertarCarritoStorage(){
    sumarTotalStorage(miCarrito);
    console.log("El carrito actualmente contiene: "+miCarrito.length+ " collages. Precio total: "+precioTotal);
    console.log(miCarrito);
    miCarrito.forEach(productoStorage=>{                        //insertamos en el html lo convertido previamente 
        document.getElementById("tablaBody").innerHTML+=`
        <tr>
            <td>${productoStorage.id}</td>
            <td>${productoStorage.nombre}</td>
            <td>${productoStorage.precio}</td>
        </tr>`;
    })
}

function sumarTotalStorage(carroActual){           //función sumatoria de precios solo para lo guardado en el storage
    for(const producto of carroActual){
        precioTotal+=producto.precio;       //sugar syntax
    }
}

let galeriaProductos=document.getElementById("galeriaProductos");           //nodo padre de la galería

insertarGaleria();

function insertarGaleria(){                                  //función que inserta toda la galería de productos
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
    

        productosCollage.forEach(producto=>{                                              //usando sweet alert como vista previa del producto a agregar al carro
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

        productosCollage.forEach(producto=>{                                              //asignamos un evento click por cada botón
            document.getElementById(`btn_${producto.id}`).addEventListener('click', function(){ 
                agregarAlCarro(producto);
            })
        });
    })
}

function agregarAlCarro(productoAgregado){        //función que pushea cada producto nuevo al array del carrito
    miCarrito.push(productoAgregado);
    precioTotal+=productoAgregado.precio;
    console.log("Se ha agregado collage "+productoAgregado.nombre+" al carrito. El carrito actualmente contiene: "+miCarrito.length+ " collages. Precio total: "+precioTotal)
    console.log(miCarrito);
    document.getElementById("tablaBody").innerHTML+=`
        <tr>
            <td>${productoAgregado.id}</td>
            <td>${productoAgregado.nombre}</td>
            <td>${productoAgregado.precio}</td>
        </tr>
    `;
    resultadoTablaTotal();
    localStorage.setItem("miCarrito", JSON.stringify(miCarrito));    //guardamos el carrito en el local storage mediante setItem y JSON.stringify
    
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

function resultadoTablaTotal(){

    let precioConIva=precioTotal+precioTotal*iva;

    document.getElementById("tablaTotal").innerHTML=`
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Subtotal: $ ${precioTotal} CLP</th>
        </tr>
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">IVA (19%): $ ${precioTotal*iva} CLP</th>
        </tr>
        <tr>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Total: $ ${precioConIva} CLP</th>
        </tr>`;
}




