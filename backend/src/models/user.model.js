import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    fullname: {
      type: String,
    },
    role: {
      type: String,
      default: 'customer',
      enum: ['customer', 'admin', 'staff'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['inactive', 'active'],
    },
    avatar: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
