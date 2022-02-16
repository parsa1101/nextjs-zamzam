import nc from 'next-connect'
import moment from 'jalali-moment'
import { isAuth, isAdmin } from '../../../../../../utils/auth'
import { onError } from '../../../../../../utils/error'
import db from '../../../../../../utils/db'
import Question from '../../../../../../models/question'

const handler = nc({
  onError
})
handler.use(isAuth, isAdmin)

handler.get(async (req, res) => {
  let chartInfo = [
    { month: '1', count: 0 },
    { month: '2', count: 0 },
    { month: '3', count: 0 },
    { month: '4', count: 0 },
    { month: '5', count: 0 },
    { month: '6', count: 0 },
    { month: '7', count: 0 },
    { month: '8', count: 0 },
    { month: '9', count: 0 },
    { month: '10', count: 0 },
    { month: '11', count: 0 },
    { month: '12', count: 0 }
  ]

  let index
  let sumCount = 0
  const { year } = req.query
  await db.connect()
  const questions = await Question.find({})

  for (var i = 0, len = questions.length; i < len; i++) {
    const createdAt = questions[i].createdAt
    const year2 = moment(createdAt, 'YYYY-M-D HH:mm:ss')
      .locale('fa')
      .format('YYYY/M/D')

    const date = year2.split('/')

    if (year === date[0]) {
      let data = [...chartInfo]

      index = data.findIndex(obj => obj.month === date[1])

      data[index].count = data[index].count + 1
      chartInfo = [...data]
    }
  }

  await db.disconnect()

  for (var j = 0, len2 = chartInfo.length; j < len2; j++) {
    sumCount = chartInfo[j].count + sumCount
  }
  res.send({ chartInfo, sumCount })
})

export default handler
