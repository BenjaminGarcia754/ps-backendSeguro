class CompraDTO {
    producto;
    cantidad;
    correousuario;
    constructor(producto, cantidad,correousuario) {
        this.producto = producto; // El objeto completo del producto
        this.cantidad = cantidad; // La cantidad de productos
        this.correousuario = correousuario; // El id del usuario que realiza la compra
    }
}

module.exports = CompraDTO;
