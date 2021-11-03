import nc from "next-connect";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";
import { signToken, isAuth } from "../../../utils/auth";

const handler = nc({
  onError: (err, req, res, ) => {
    console.error(err.stack);
    res.status(500).end("Something broke ");
  },
  onNoMatch: (req, res, ) => {
    res.status(404).end("Bad Request");
  },
})
  .use(isAuth)
  .put(async (req, res) => {
    await db.connect();
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password
      ? bcrypt.hashSync(req.body.password)
      : user.password;
    await user.save();
    await db.disconnect();

    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  });

export default handler;
