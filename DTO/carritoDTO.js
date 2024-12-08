class CompraDTO {
    producto;
    cantidad;
    usuarioid;
    constructor(producto, cantidad,usuarioid) {
        this.producto = producto; // El objeto completo del producto
        this.cantidad = cantidad; // La cantidad de productos
        this.usuarioid = usuarioid; // El id del usuario que realiza la compra
    }
}

module.exports = CompraDTO;
