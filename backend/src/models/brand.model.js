import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const brandSchema = new mongoose.Schema(
  {
    nameBrand: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'Viet Nam',
    },
    desc: {
      type: String,
    },
    images: [
      {
        url: {
          type: String,
        },
        public_id: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive'],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

brandSchema.plugin(mongoosePaginate);

const Brand = mongoose.model('brand', brandSchema);

export default Brand;
