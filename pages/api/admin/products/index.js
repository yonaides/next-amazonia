import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Product from "../../../../models/Product";
import db from "../../../../utils/db";
import onError from "../../../../utils/error";

const handler = nc({
  onError,
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found , on register user");
  },
})
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
  })
  .post(async (req, res) => {
    await db.connect();
    const newProduct = new Product({
      name: "sample name",
      slug: "sample-slug-" + Math.random(),
      image: "/images/shirt1.jpg",
      price: 0,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      description: "sample description",
      rating: 0,
      numReviews: 0,
    });

    const product = await newProduct.save();
    await db.disconnect();
    res.send({ message: "Product Created", product });
  });

export default handler;
