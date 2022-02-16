import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'

import bcrypt from 'bcryptjs'
import User from '../../../../models/user'
import { onError } from '../../../../utils/error'

const handler = nc({ onError })
handler.use(isAuth, isAdmin)

handler.post(async (req, res) => {
  const userRoles = []
  req.body.userRoles.map(item => userRoles.push(item._id))
  await db.connect()
  const { nameFamily, email, mobile, password } = req.body
  const checkEmail = await User.findOne({ email: email })
  if (checkEmail) {
    await db.disconnect()
    res.status(401).send({ message: 'ایمیل وارد شده تکراری است' })
  }

  const checkMobile = await User.findOne({ mobile: mobile })
  if (checkMobile) {
    await db.disconnect()
    res.status(401).send({ message: 'تلفن همراه وارد شده تکراری است' })
  }

  const newUser = {
    nameFamily: nameFamily,
    email: email,
    mobile: mobile,
    roles: userRoles,
    password: bcrypt.hashSync(password)
  }

  try {
    await User.insertMany(newUser)
  } catch (err) {
    res.send(err.message)
  }

  const users = await User.find({}).sort({ createdAt: -1 })
  await db.disconnect()
  res.send(users)
})

export default handler
