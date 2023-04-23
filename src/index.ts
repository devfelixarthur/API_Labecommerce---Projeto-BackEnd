import { DESTINOS, TProduct, TPurchase, TPurchaseWithProduct, TUser } from "./types";
import express, { Request, Response } from "express";
import { db } from "./database/knex";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

//   Endpoint getAllUsers

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.select("*").from("users");
    res.status(200).send({ result });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});

//   Endpoint getAllProducts

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.select("*").from("products");
    res.status(200).send({ result });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});


//   Endpoint getProductByName

app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;

    if (q === undefined || q.length === 0) {
      res.status(400);
      throw new Error("A query params deve possuir pelo menos um caracter.");
    }

    const result = await db.select("*").from("products").where("name", "like", `%${q}%`);

    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Endpoint createUser
app.post("/users", async (req: Request, res: Response) => {
  try {
    const newId: string = Math.floor(Date.now() * Math.random()).toString(36);
    const newName: string = req.body.name;
    const newEmail: string = req.body.email;
    const newPassword: string = req.body.password;
    const newCreateAt: any = new Date().toISOString();

    if (!newEmail || !newPassword) {
      res.status(400);
      throw new Error("'Email' e 'Password' não foram enviados.");
    }

    const findEmail = await db.raw(`SELECT * FROM users WHERE email = "${newEmail}";`);

if (findEmail.length > 0) {
  res.status(400);
  throw new Error(`'Email' já cadastrado em outra conta.`);
}

    const newUser: TUser = {
      id: newId,
      name: newName,
      email: newEmail,
      password: newPassword,
      createAt: newCreateAt,
    };

    const result = await db.raw(`INSERT INTO users (id, name, email, password, createAt) 
    VALUES ("${newUser.id}", "${newUser.name}", "${newUser.email}", "${newUser.password}", "${newUser.createAt}");`);

    res.status(201).send("Cadastro realizado com sucesso.");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Endpoint createNewProduct

app.post("/products", async (req: Request, res: Response) => {
  try {

    const id: string = Math.floor(Date.now() * Math.random()).toString(36);
    const name: string = req.body.name;
    const price: number = req.body.price;
    const category: DESTINOS = req.body.category;
    const description: string = req.body.description;
    const imageUrl: string = req.body.imageUrl;

    if (!name || !price || !category || !description || !imageUrl) {
      res.status(404);
      throw new Error(
        "'Name', 'Price', 'Category', 'Description' e/ou 'ImageUrl' não foi enviado, verifique o body da requisição."
      );
    }

    const [findName] = await db.raw(
      `SELECT * FROM products WHERE name = "${name}";`
    );

    if (name && price && category) {
      if (findName && findName.length === 1) {
        res.status(404);
        throw new Error("Já existe um produto cadastrado com esse 'nome'");
      } else {
        const newProduct: TProduct = {
          id,
          name,
          price,
          category,
          description,
          imageUrl,
        };
        const result = await db.raw(
          `INSERT INTO products (id, name, price, category, description, imageUrl) VALUES ("${newProduct.id}", "${newProduct.name}", ${newProduct.price}, "${newProduct.category}", "${newProduct.description}", "${newProduct.imageUrl}");`
        );
      }
    }
    res.status(201).send("Produto cadastrado com sucesso.");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Endpoint Create Purchase

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const purchaseId: string = Math.floor(Date.now() * Math.random()).toString(36);
    const userId: string = req.body.userId;
    const productId: string = req.body.productId;
    const quantity: number = req.body.quantity;
    const paid: boolean = req.body.paid;

    if (!userId || !productId || !quantity || !paid) {
      res.status(400);
      throw new Error("'userId', 'productId', 'quantity', e/ou 'paid' não foram enviados, verifique o body da requisição.");
    }

    const [buyer] = await db.raw(`
      SELECT *
      FROM users
      WHERE id = '${userId}'
    `);

    if (!buyer) {
      res.status(404);
      throw new Error("Usuário não encontrado na base de dados dos usuários cadastrados, verifique a informação.");
    }

    const [product] = await db.raw(`
      SELECT *
      FROM products
      WHERE id = '${productId}'
    `);

    if (!product) {
      res.status(404);
      throw new Error("Produto não encontrado na base de dados dos produtos cadastrados, verifique a informação.");
    }

    const totalPrice: number = product.price * quantity;

    await db.transaction(async (trx) => {
      await trx.raw(`
        INSERT INTO purchases (id, buyer_id, buyer_name, totalPrice, paid)
        VALUES ('${purchaseId}', '${userId}', '${buyer.name}', ${totalPrice}, ${paid ? 1 : 0})
      `);

      await trx.raw(`
        INSERT INTO purchase_products (id, purchase_id, product_id)
        VALUES ('${Math.floor(Date.now() * Math.random()).toString(36)}', '${purchaseId}', '${productId}')
      `);
    });

    const [newPurchase] = await db.raw(`
      SELECT *
      FROM purchases
      WHERE id = '${purchaseId}'
    `);

    const [productInPurchase] = await db.raw(`
      SELECT products.*
      FROM purchase_products
      JOIN products ON purchase_products.product_id = products.id
      WHERE purchase_products.purchase_id = '${purchaseId}'
    `);

    const newPurchaseWithProduct: TPurchaseWithProduct = {
      ...newPurchase,
      products: productInPurchase,
    };

    res.status(201).send('Compra realizada com sucesso');

  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Endpoint GET PRODUCT BY ID
app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const [result] = await db.raw(`
    SELECT * FROM products WHERE id = "${id}"
    ;`);

    if (result.length === 0) {
      res.status(404);
      throw new Error("'id' não encontrado.");
    }

    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Endpoint GET PURCHASE BY BUYER ID

app.get("/products/:id/purchases", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    if (!id) {
      res.status(404);
      throw new Error("Forneceça um 'id' válido");
    }

    const [findUser] = await db.raw(`
    SELECT * FROM users WHERE id="${id}"
    ;`);

    const [hasPurchase] = await db.raw(`
    SELECT * FROM purchases WHERE buyer_id = "${id}"
    ;`);

    if (findUser.length === 0) {
      res.status(404);
      throw new Error("'id' do usuário não encontrado");
    } else if (hasPurchase.length === 0) {
      res.status(400);
      throw new Error(
        "não foi encontrado nenhuma purchase para o 'id' fornecido"
      );
    }
    const result = await db.raw(`
    SELECT * FROM purchases WHERE buyer_id = "${id}"
    ;`);

    res.status(200).send(result);
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

//Endpoint DELETE USER BY ID
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

// Verifica se existem compras atreladas ao usuário
    const checkPurchases = await db.raw(`
      SELECT * FROM purchases WHERE buyer_id = '${id}'
    `);

    if (checkPurchases.length > 0) {
      res.status(400);
      throw new Error("Não é possível excluir o usuário pois há compras atreladas a este id");
    }

    const findUser = await db.raw(`
      SELECT * FROM users WHERE id = '${id}'
    `);

    if (findUser.length === 0) {
      res.status(404);
      throw new Error("Forneça um 'id' cadastrado");
    }

    const result = await db.raw(`
      DELETE FROM users WHERE id = '${id}'
    `);

    res.status(200).send("Usuário apagado com sucesso");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});


// Endpoint Delete Product by Id
app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const [findProduct] = await db.raw(`
      SELECT * FROM products WHERE id = "${id}"
    `);

    if (!findProduct) {
      res.status(404);
      throw new Error("Produto não encontrado");
    }

    const [hasPurchases] = await db.raw(`
  SELECT * FROM purchases WHERE id IN (
    SELECT purchase_id FROM purchase_products WHERE product_id = '${id}'
  )
`);

if (hasPurchases) {
  res.status(400);
  throw new Error("Não é possível excluir o produto pois há compras atreladas a este id");
}

    await db.raw(`
      DELETE FROM products WHERE id = '${id}'
    `);

    res.status(200).send("Produto apagado com sucesso");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// Endpoint Edit User By Id

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    const findUserById = await db.raw(`
    SELECT * FROM users WHERE id = "${id}"
    ;`);

    if (!findUserById) {
      res.status(404);
      throw new Error("Usuário não encontrado");
    }

    const newEmail: string = req.body.email;
    const newName: string = req.body.name;
    const newPassword: string = req.body.password;

    if (!newName && !newEmail && !newPassword) {
      throw new Error("Nenhum campo foi enviado para atualização");
    }

    const updateFields: string[] = [];
    if (newName) updateFields.push(`name = "${newName}"`);
    if (newEmail) updateFields.push(`email = "${newEmail}"`);
    if (newPassword) updateFields.push(`password = "${newPassword}"`);

    if (updateFields.length === 0) {
      res.status(400);
      throw new Error("Nenhum campo foi enviado para atualização.");
    }

    // Junta os campos em uma query SQL
    const updateQuery: string = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE id = "${id}"
    `;

    const result = await db.raw(updateQuery);

    res.status(200).send("Cadastro atualizado com sucesso");
  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

// Endpoint Edit Product By Id

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newCategory = req.body.category;
    const newDescription = req.body.description;
    const newImageUrl = req.body.imageUrl;

    const [searchProduct] = await db.raw(`
      SELECT * FROM products WHERE id = "${id}"
    ;`);

    if (searchProduct.length === 0) {
      res.status(404);
      throw new Error("Produto não encontrado. Verifique o 'id'");
    }

    if (newName !== undefined && typeof newName !== "string") {
      res.status(400);
      throw new Error("'name' deve ser do tipo 'string'");
    }

    if (newDescription !== undefined && typeof newDescription !== "string") {
      res.status(400);
      throw new Error("'description' deve ser do tipo 'string'");
    }

    if (newImageUrl !== undefined && typeof newImageUrl !== "string") {
      res.status(400);
      throw new Error("'imageUrl' deve ser do tipo 'string'");
    }

    if (newPrice !== undefined && typeof newPrice !== "number") {
      res.status(400);
      throw new Error("'price' deve ser do tipo 'number'");
    }

    if (
      newCategory !== undefined &&
      !Object.values(DESTINOS).includes(newCategory)
    ) {
      res.status(400);
      throw new Error(
        "'category' deve ter um tipo válido: 'America', 'Europa', 'Africa', 'Asia'."
      );
    }

    const updateDados: string[] = [];
    if (newName) updateDados.push(`name = "${newName}"`);
    if (newPrice) updateDados.push(`price = ${newPrice}`);
    if (newCategory) updateDados.push(`category = "${newCategory}"`);
    if (newDescription) updateDados.push(`description = "${newDescription}"`);
    if (newImageUrl) updateDados.push(`imageUrl = "${newImageUrl}"`);

    if (updateDados.length === 0) {
      res.status(400);
      throw new Error("Nenhum campo foi enviado para atualização.");
    }

    const updateDadosQuery: string = `
      UPDATE products
      SET ${updateDados.join(", ")}
      WHERE id = "${id}"
    ;`;

    const result = await db.raw(updateDadosQuery);

    res.status(200).send("Produto atualizado com sucesso");

  } catch (error: any) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});


//  CRIAÇÃO DO ENDPOINT GET PURCHASE BY ID

app.get("/purchases/:purchaseId", async (req: Request, res: Response) => {
  try {
    const purchaseId: string = req.params.purchaseId;

    const [purchase] = await db.raw(`
      SELECT *
      FROM purchases
      WHERE id = '${purchaseId}'
    `);

    if (!purchase) {
      res.status(404);
      throw new Error("Compra não encontrada na base de dados das compras realizadas, verifique a informação.");
    }

    const productInPurchase = await db.raw(`
    SELECT products.*, purchase_products.quantity
    FROM purchase_products
    JOIN products ON purchase_products.product_id = products.id
    WHERE purchase_products.purchase_id = '${purchaseId}'    
    `);

    const purchaseWithProduct: TPurchaseWithProduct = {
      id: purchase.id,
      buyer_id: purchase.buyer_id,
      buyer_name: purchase.buyer_name,
      totalPrice: purchase.totalPrice,
      paid: Boolean(purchase.paid),
      createdAt: purchase.createdAt,
      products: [
        productInPurchase
      ]
    };

    res.status(200).json(purchaseWithProduct);
  } catch (error) {
    res.status(error.status || 500).send(error.message);
  }
});