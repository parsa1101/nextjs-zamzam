import mongoose from 'mongoose'
const educationInfoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    major: { type: String },
    universityName: { type: String },
    evidence: { type: String },
    educationStatus: { type: Boolean, default: true },
    provinceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
  },
  {
    timestamps: true
  }
)

const EducationInfo =
  mongoose.models.EducationInfo ||
  mongoose.model('EducationInfo', educationInfoSchema)
export default EducationInfo
