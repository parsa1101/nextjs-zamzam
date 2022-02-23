import nextConnect from 'next-connect'
import { onError } from '../../../utils/error'
import { isAuth } from '../../../utils/auth'
import multer from 'multer'

export const config = {
  api: {
    bodyParser: false
  }
}

const handler = nextConnect({ onError })
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/media',
    filename: (req, file, cb) => cb(null, file.originalname)
  })
})

handler.use(isAuth, upload.single('file')).post(async (req, res) => {
  res.status(200).json({ data: 'success' })
})

export default handler
