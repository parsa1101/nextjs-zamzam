import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import { signToken, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import User from '../../../models/user';
import { onError } from '../../../utils/error';
const handler = nc({
  onError,
});
handler.use(isAuth);

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.user._id);
  user.userName = req.body.userName;
  user.email = req.body.email;
  user.mobile = req.body.mobile;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password)
    : user.password;
  await user.save();
  await db.disconnect();

  const token = signToken(user);
  res.send({
    token,
    _id: user._id,
    userName: user.userName,
    email: user.email,
    mobile: user.mobile,
    isAdmin: user.isAdmin,
  });
});

export default handler;
