import nc from 'next-connect'
import WorkInfo from '../../../../../models/workInfo'
import { isAuth } from '../../../../../utils/auth'
import db from '../../../../../utils/db'
import { onError } from '../../../../../utils/error'

const handler = nc({ onError })

handler.use(isAuth)

handler.post(async (req, res) => {
  await db.connect()
  const { userId } = req.body
  try {
    const work = await WorkInfo.findOne({ userId })
    if (work) {
      const id = work._id.toString()
      await WorkInfo.findByIdAndUpdate(id, req.body)
    } else {
      await WorkInfo.insertMany(req.body)
    }
    await db.disconnect()
    res.send({ message: 'addedSuccessfully' })
  } catch (err) {
    await db.disconnect()
    res.status(401).send({ message: 'ثبت اطلاعات با مشکل مواجه شده است' })
  }
})

export default handler
