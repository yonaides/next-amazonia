import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../../utils/auth";
import User from "../../../../../models/User";
import db from "../../../../../utils/db";
import {onError} from  "../../../../../utils/error";

const handler = nc({
  onError,
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found , on register user");
  },
})
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    await db.disconnect();
    res.send(user);
  })
  .put(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
      user.name = req.body.name;
      user.slug = req.body.slug;
      user.price = req.body.price;
      user.category = req.body.category;
      user.image = req.body.image;
      user.brand = req.body.brand;
      user.countInStock = req.body.countInStock;
      user.description = req.body.description;
      await user.save();
      await db.disconnect();
      res.send({ message: "User Updated Successfully" });
    } else {
      await db.disconnect();
      res.status(404).send({ message: "User Not Found" });
    }
  })
  .delete(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.query.id);
    if (user) {
      await user.remove();
      await db.disconnect();
      res.send({ message: "User Deleted" });
    } else {
      await db.disconnect();
      res.status(404).send({ message: "User Not Found" });
    }
  });

export default handler;
