import nc from 'next-connect'
import { isAuth } from '../../../../utils/auth'
import db from '../../../../utils/db'
import { onError } from '../../../../utils/error'
import Role from '../../../../models/role'
import User from '../../../../models/user'

const handler = nc({
  onError
})
handler.use(isAuth)

handler.get(async (req, res) => {
  await db.connect()
  let isExpert = false
  const role = await Role.findOne({ name: 'expert' })
  if (role) {
    const user = await User.findById(req.query.id)
    if (user) {
      const list = []
      user.roles.forEach(role => {
        list.push(role._id.toString())
      })

      if (list.length > 0) {
        const findItem = list.find(item => {
          return item === role._id.toString()
        })
        if (findItem) {
          isExpert = true
        }
      }
    }
    await db.disconnect()
    res.send(isExpert)
  }
})
export default handler
