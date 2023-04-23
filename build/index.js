"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const express_1 = __importDefault(require("express"));
const knex_1 = require("./database/knex");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield knex_1.db.raw(`SELECT * FROM users;`);
        res.status(200).send({ result });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield knex_1.db.raw(`SELECT * FROM products`);
        res.status(200).send({ result });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}));
app.get("/products/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = req.query.q;
        if (q === undefined || q.length === 0) {
            res.status(400);
            throw new Error("A query params deve possuir pelo menos um caracter.");
        }
        const result = yield knex_1.db.select("*").from("products").whereRaw("name LIKE ?", [`%${q}%`]);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newId = Math.floor(Date.now() * Math.random()).toString(36);
        const newName = req.body.name;
        const newEmail = req.body.email;
        const newPassword = req.body.password;
        const newCreateAt = new Date().toISOString();
        if (!newEmail || !newPassword) {
            res.status(400);
            throw new Error("'Email' e 'Password' não foram enviados.");
        }
        const [findEmail] = yield knex_1.db.raw(`SELECT * FROM users WHERE email = "${newEmail}";`);
        if (findEmail && findEmail.length > 0) {
            res.status(400);
            throw new Error(`'Email' já cadastrado em outra conta.`);
        }
        const newUser = {
            id: newId,
            name: newName,
            email: newEmail,
            password: newPassword,
            createAt: newCreateAt,
        };
        const result = yield knex_1.db.raw(`INSERT INTO users (id, name, email, password, createAt) 
    VALUES ("${newUser.id}", "${newUser.name}", "${newUser.email}", "${newUser.password}", "${newUser.createAt}");`);
        res.status(201).send("Cadastro realizado com sucesso.");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Math.floor(Date.now() * Math.random()).toString(36);
        const name = req.body.name;
        const price = req.body.price;
        const category = req.body.category;
        const description = req.body.description;
        const imageUrl = req.body.imageUrl;
        if (!name || !price || !category || !description || !imageUrl) {
            res.status(404);
            throw new Error("'Name', 'Price', 'Category', 'Description' e/ou 'ImageUrl' não foi enviado, verifique o body da requisição.");
        }
        const [findName] = yield knex_1.db.raw(`SELECT * FROM products WHERE name = "${name}";`);
        if (name && price && category) {
            if (findName && findName.length === 1) {
                res.status(404);
                throw new Error("Já existe um produto cadastrado com esse 'nome'");
            }
            else {
                const newProduct = {
                    id,
                    name,
                    price,
                    category,
                    description,
                    imageUrl,
                };
                const result = yield knex_1.db.raw(`INSERT INTO products (id, name, price, category, description, imageUrl) VALUES ("${newProduct.id}", "${newProduct.name}", ${newProduct.price}, "${newProduct.category}", "${newProduct.description}", "${newProduct.imageUrl}");`);
            }
        }
        res.status(201).send("Produto cadastrado com sucesso.");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.post("/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchaseId = Math.floor(Date.now() * Math.random()).toString(36);
        const userId = req.body.userId;
        const productId = req.body.productId;
        const quantity = req.body.quantity;
        const paid = req.body.paid;
        if (!userId || !productId || !quantity || !paid) {
            res.status(400);
            throw new Error("'userId', 'productId', 'quantity', e/ou 'paid' não foram enviados, verifique o body da requisição.");
        }
        const [findUserResult] = yield knex_1.db.raw(`
      SELECT *
      FROM users
      WHERE id = '${userId}'
    `);
        if (findUserResult.length === 0) {
            res.status(404);
            throw new Error("Usuário não encontrado na base de dados dos usuários cadastrados, verifique a informação.");
        }
        const [findProductResult] = yield knex_1.db.raw(`
      SELECT *
      FROM products
      WHERE id = "${productId}"
    `);
        if (findProductResult.length === 0) {
            res.status(404);
            throw new Error("Produto não encontrado na base de dados dos produtos cadastrados, verifique a informação.");
        }
        console.log(findProductResult);
        const product = findProductResult[0];
        const totalPrice = product.price * quantity;
        const newPurchase = {
            purchaseId: purchaseId,
            buyer_id: userId,
            buyer_name: findUserResult.rows[0].name,
            totalPrice: totalPrice,
            paid: paid ? 1 : 0,
        };
        yield knex_1.db.raw(`
      INSERT INTO purchases (id, buyer_id, buyer_name, totalPrice, paid)
      VALUES ('${newPurchase.purchaseId}', '${newPurchase.buyer_id}', '${newPurchase.buyer_name}', ${newPurchase.totalPrice}, ${newPurchase.paid})
    `);
        res.status(201).send("Compra realizada com sucesso.");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.get("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const [result] = yield knex_1.db.raw(`
    SELECT * FROM products WHERE id = "${id}"
    ;`);
        if (result.length === 0) {
            res.status(404);
            throw new Error("'id' não encontrado.");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.get("/products/:id/purchases", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(404);
            throw new Error("Forneceça um 'id' válido");
        }
        const [findUser] = yield knex_1.db.raw(`
    SELECT * FROM users WHERE id="${id}"
    ;`);
        const [hasPurchase] = yield knex_1.db.raw(`
    SELECT * FROM purchases WHERE buyer_id = "${id}"
    ;`);
        if (findUser.length === 0) {
            res.status(404);
            throw new Error("'id' do usuário não encontrado");
        }
        else if (hasPurchase.length === 0) {
            res.status(400);
            throw new Error("não foi encontrado nenhuma purchase para o 'id' fornecido");
        }
        const result = yield knex_1.db.raw(`
    SELECT * FROM purchases WHERE buyer_id = "${id}"
    ;`);
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const findUser = yield knex_1.db.raw(`
      SELECT * FROM users WHERE id = '${id}'
    `);
        if (findUser.length === 0) {
            res.status(404);
            throw new Error("Forneça um 'id' cadastrado");
        }
        const result = yield knex_1.db.raw(`
      DELETE FROM users WHERE id = '${id}'
    `);
        res.status(200).send("Usuário apagado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.delete("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const [findProduct] = yield knex_1.db.raw(`
    SELECT * FROM products WHERE id = "${id}"
    ;`);
        if (findProduct.length === 0) {
            res.status(404);
            throw new Error("Forneça um 'id' cadastrado");
        }
        const result = yield knex_1.db.raw(`
    DELETE FROM products WHERE id = '${id}'
  `);
        res.status(200).send("Produto apagado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const [findUserById] = yield knex_1.db.raw(`
    SELECT * FROM users WHERE id = "${id}"
    ;`);
        if (findUserById.length === 0) {
            res.status(404);
            throw new Error("Usuário não encontrado");
        }
        const newEmail = req.body.email;
        const newPassword = req.body.password;
        if (!newEmail && !newPassword) {
            throw new Error("Nenhum campo foi enviado para atualização");
        }
        const result = yield knex_1.db.raw(`
    UPDATE users
    SET email = "${newEmail}", password = "${newPassword}"
    WHERE id = "${id}"
    ;`);
        res.status(200).send("Cadastro atualizado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
app.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newName = req.body.name;
        const newPrice = req.body.price;
        const newCategory = req.body.category;
        const [searchProduct] = yield knex_1.db.raw(`
        SELECT * FROM products WHERE id = "${id}"
    ;`);
        if (searchProduct.length === 0) {
            res.status(404);
            throw new Error("Produto não encontrado. Verifique o 'id'");
        }
        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400);
                throw new Error("'name' deve ser do tipo 'string'");
            }
        }
        if (newPrice !== undefined) {
            if (typeof newPrice !== "number") {
                res.status(400);
                throw new Error("'price' deve ser do tipo 'number'");
            }
        }
        if (newCategory !== undefined) {
            if (newCategory !== types_1.DESTINOS.AMERICA &&
                newCategory !== types_1.DESTINOS.EUROPA &&
                newCategory !== types_1.DESTINOS.AFRICA &&
                newCategory !== types_1.DESTINOS.ASIA) {
                res.status(400);
                throw new Error("'category' deve ter um tipo válido: 'America', 'Euroa', 'Africa', 'Asia'.");
            }
        }
        yield knex_1.db.raw(`
      UPDATE products
      SET 
        name = "${newName || searchProduct.name}",
        price = "${newPrice || searchProduct.price}",
        category = "${newCategory || searchProduct.category}"
      WHERE id = "${id}"
    ;`);
        res.status(200).send("Produto atualizado com sucesso");
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
}));
//# sourceMappingURL=index.js.map