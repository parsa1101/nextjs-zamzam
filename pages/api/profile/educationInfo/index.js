import nc from 'next-connect';
import EducationInfo from '../../../../models/educationInfo';
import { isAuth } from '../../../../utils/auth';
import db from '../../../../utils/db';
import { onError } from '../../../../utils/error';

const handler = nc({ onError });

handler.use(isAuth);

handler.post(async (req, res) => {
  await db.connect();
  const { userId } = req.body;
  try {
    const info = await EducationInfo.findOne({ userId });
    if (info) {
      const id = info._id.toString();
      await EducationInfo.findByIdAndUpdate(id, req.body);
    } else {
      await EducationInfo.insertMany(req.body);
    }
    await db.disconnect();
    res.send({ message: 'addedSuccessfully' });
  } catch (err) {
    await db.disconnect();
    res.status(401).send({ message: err.message });
  }
});

export default handler;
