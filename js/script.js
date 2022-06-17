//variables globales:

let miCarrito=[];
let precioTotal = 0;
let iva=0.19;

if(localStorage.getItem("miCarrito")!=null){                    //condicional que revisa si hay cargado local storage
    miCarrito=JSON.parse(localStorage.getItem("miCarrito"));          //convertimos lo guardado en el storage a objeto javascript
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
    resultadoTablaTotal();
}

function sumarTotalStorage(carroActual){           //función sumatoria de precios solo para lo guardado en el storage
    for(const producto of carroActual){
        precioTotal=precioTotal+producto.precio;
    }
}

let galeriaProductos=document.getElementById("galeriaProductos");           //nodo padre de la galería

insertarGaleria();

function insertarGaleria(){                                  //función que inserta toda la galería de productos
    for (const producto of productosCollage){
        galeriaProductos.innerHTML+=`
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3 d-flex">
            <div class="item__galeriaCollage">
                <img src=${producto.foto} alt="microbloqueo_${producto.id}">
                <h5 class="text-center my-2">${producto.nombre}</h5>
                <p class="text-center mb-2"><strong>$ ${producto.precio} CLP</strong></p>
                <p class="text-center mb-1">ID: ${producto.id} </p>
                <button id="btn_${producto.id}" class="btn btn-danger">Agregar al carrito</button>
                </div>
        </div>`;
    }
    productosCollage.forEach(producto=>{                                              //asignamos un evento click por cada botón
        document.getElementById(`btn_${producto.id}`).addEventListener('click', function(){       
            agregarAlCarro(producto);
        })
    });
}

function agregarAlCarro(productoAgregado){        //función que pushea cada producto nuevo al array del carrito
    miCarrito.push(productoAgregado);
    precioTotal=precioTotal+productoAgregado.precio;
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
    alert("Se ha agregado el producto "+productoAgregado.nombre+" al carro. (Carrito de compras al final de la página)");

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




