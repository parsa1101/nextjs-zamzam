import nc from 'next-connect';
import { onError } from '../../../utils/error';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import User from '../../../models/user';
import Question from '../../../models/question';
const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const questionsCount = await Question.countDocuments();
  const usersCount = await User.countDocuments();
  const questionsGroup = await Question.aggregate([
    {
      $group: {
        _id: null,
        s_count: { $sum: '$s_count' },
        c_count: { $sum: '$c_count' },
      },
    },
  ]);
  const questionSeenCount = await Question.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalSeen: { $sum: '$s_count' },
      },
    },
  ]);
  await db.disconnect();
  res.send({ questionsCount, questionsGroup, usersCount, questionSeenCount });
});

export default handler;
