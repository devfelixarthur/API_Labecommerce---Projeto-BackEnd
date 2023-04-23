"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.getProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchase = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
    {
        id: "001",
        email: "Teste@gmail.com",
        password: "ARTHUR_FELIX",
    },
    {
        id: "002",
        email: "Teste2@gmail.com",
        password: "JULIANA_GOMES",
    },
];
exports.products = [
    {
        id: "001",
        name: "Argentina",
        price: 859.0,
        category: types_1.Destinos.AMERICA,
    },
    {
        id: "002",
        name: "Espanha",
        price: 2582.0,
        category: types_1.Destinos.EUROPA,
    },
];
exports.purchase = [
    {
        userId: "001",
        productId: "001",
        quantity: 1,
        totalPrice: 859.0,
    },
    {
        userId: "001",
        productId: "002",
        quantity: 1,
        totalPrice: 2582.0,
    },
];
function createUser(id, email, password) {
    exports.users.push({ id, email, password });
    return "Cadastro realizado com sucesso";
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, category) {
    exports.products.push({ id, name, price, category });
    return "Produto cadastrado com sucesso";
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(idToSearch) {
    return exports.products.find((product) => product.id === idToSearch);
}
exports.getProductById = getProductById;
function getProductsByName(q) {
    return exports.products.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));
}
exports.getProductsByName = getProductsByName;
function createPurchase(userId, productId, quantity, totalPrice) {
    exports.purchase.push({ userId, productId, quantity, totalPrice });
    return 'Compra realizada com sucesso';
}
exports.createPurchase = createPurchase;
function getAllPurchasesFromUserId(userIdToSearch) {
    return exports.purchase.filter((purchase) => purchase.userId === userIdToSearch);
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=database.js.map