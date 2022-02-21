// import nc from 'next-connect'
// import WorkInfo from '../../../../../models/workInfo'

// import { isAuth } from '../../../../../utils/auth'
// import db from '../../../../../utils/db'
// import { onError } from '../../../../../utils/error'
// const handler = nc({ onError })
// handler.use(isAuth)

// handler.get(async (req, res) => {
//   await db.connect()
//   const { userId } = req.query
//   try {
//     const userInfo = await WorkInfo.findOne({ userId: userId })
//     await db.disconnect()
//     res.send(userInfo)
//   } catch (err) {
//     await db.disconnect()
//     res.status(401).send({ message: err.message })
//   }
// })

// export default handler
