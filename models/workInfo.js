import mongoose from 'mongoose'
const workInfoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    work: { type: String },
    workName: { type: String },
    provinceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
  },
  {
    timestamps: true
  }
)

const WorkInfo =
  mongoose.models.WorkInfo || mongoose.model('WorkInfo', workInfoSchema)
export default WorkInfo
