import mongoose from 'mongoose'
const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    nameFamily: { type: String },
    homePhone: { type: String },
    homeAddress: { type: String },
    male: { type: Boolean, default: true },
    married: { type: Boolean, default: false },
    provinceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' }
  },
  {
    timestamps: true
  }
)

const Profile =
  mongoose.models.Profile || mongoose.model('Profile', profileSchema)
export default Profile
