import nc from 'next-connect'
import { isAdmin, isAuth } from '../../../../../utils/auth'
import User from '../../../../../models/user'
import Profile from '../../../../../models/profile'
import WorkInfo from '../../../../../models/workInfo'
import EducationInfo from '../../../../../models/educationInfo'
import db from '../../../../../utils/db'

const handler = nc()
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  await db.connect()
  const id = req.query.id
  const user = await User.findById(id)
  let count = false
  if (user) {
    const countPrivateInfo = await Profile.count({ userId: id })
    const countWorkInfo = await WorkInfo.count({ userId: id })
    const countEducation = await EducationInfo.count({ userId: id })
    if (countEducation > 0 && countPrivateInfo > 0 && countWorkInfo > 0) {
      count = true
    }

    await db.disconnect()
    res.send(count)
  } else {
    await db.disconnect()
    res.status(404).send({ message: 'کاربر موردنظر یافت نشد' })
  }
})
export default handler
