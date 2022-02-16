import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import User from '../../../../models/user'
import Role from '../../../../models/role'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()
  const users = await User.find({}).sort({ createdAt: -1 })
  let infos = []

  for (var i = 0, len = users.length; i < len; i++) {
    let roles = []
    for (let j = 0, l = users[i].roles.length; j < l; j++) {
      const userRole = await Role.findById(users[i].roles[j])
      roles.push(userRole.name)
    }

    infos.push({
      _id: users[i]._id,
      email: users[i].email,
      mobile: users[i].mobile,
      isAdmin: users[i].isAdmin,
      createdAt: users[i].createdAt,
      nameFamily: users[i].nameFamily,
      roles: roles,
      status: users[i].status
    })
  }
  await db.disconnect()
  res.send(infos)
})

export default handler
