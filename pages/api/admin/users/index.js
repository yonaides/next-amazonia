import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import User from '../../../../models/User';
import db from '../../../../utils/db';
import {onError} from "../../../../utils/error";

const handler = nc({
  onError,
  onNoMatch: (req, res, ) => {
    res.status(404).end("Page is not found , on register user");
  },
})
.use(isAuth, isAdmin)
.get(async (req, res) => {
  await db.connect();
  const users = await User.find({});
  await db.disconnect();
  res.send(users);
});


export default handler;