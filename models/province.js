import mongoose from 'mongoose'
const provinceSchema = new mongoose.Schema(
  {
    province: { type: String, required: true },
    cityId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'City' }]
  },
  {
    timestamps: true
  }
)

const Province =
  mongoose.models.Province || mongoose.model('Province', provinceSchema)
export default Province
