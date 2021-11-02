import nc from "next-connect";
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import { signToken } from '../../../utils/auth';


const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke, on register users");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Bad Request");
  },
})
  .get((req, res) => {
    res.send("Hello world, get users - register");
  })
  .post(async (req, res) => {
    console.log(req.body.name);

    await db.connect();
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
      isAdmin: false,
    });
    const user = await newUser.save();
    await db.disconnect();

    const token = signToken(user);
    res.send({
      token,
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  })
  

export default handler;
