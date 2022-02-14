import mongoose from 'mongoose'
const userSchema = new mongoose.Schema(
  {
    nameFamily: { type: String },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    status: { type: String, required: true, default: 0 },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    token: { type: String, default: null },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }]
  },
  {
    timestamps: true
  }
)

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User
