import nc from "next-connect";
import Order from "../../../models/Order";
import { isAuth } from "../../../utils/auth";
import db from "../../../utils/db";
import { onError } from "../../../utils/error";

const handler = nc({
  onError,
  onNoMatch: (req, res, ) => {
    res.status(404).end("Page is not found");
  },
})
  .use(isAuth)
  .post(async (req, res) => {
    await db.connect();
    const newOrder = new Order({
      ...req.body,
      user: req.user._id,
    });
    const order = await newOrder.save();
    res.status(201).send(order);
  });

export default handler;
