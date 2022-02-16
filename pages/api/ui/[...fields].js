import db from '../../../utils/db';
import nc from 'next-connect';
import Ui from '../../../models/ui';

const handler = nc();

handler.get(async (req, res) => {
  const { fields } = req.query;
  await db.connect();

  const ui = await Ui.findOne({ userId: fields[0] });
  if (ui) {
    const id = ui._id.toString();
    await Ui.findByIdAndUpdate(id, JSON.parse(fields[1]));
  } else {
    let values;
    values = JSON.parse(fields[1]);
    values = { userId: fields[0], ...values };
    await Ui.insertMany(values);
  }
  await db.disconnect();
  res.send('added successfully');
});

export default handler;
