const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

const userSchema = new Schema(
  {
    user_id: { type: Number, require: true },
    user_slug: { type: String, require: true },
    user_name: { type: String, default: '' },
    user_password: { type: String, default: '' },
    user_salf: { type: String, default: '' },
    user_email: { type: String, require: true },
    user_phone: { type: String, default: '' },
    user_sex: { type: String, default: '' },
    user_avatar: { type: String, default: '' },
    user_date_of_birth: { type: Date, default: null },
    user_role: { type: Schema.Types.ObjectId, ref: 'Role' },
    user_status: {
      type: String,
      default: 'pending',
      enum: ['active', 'pending', 'block'],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, userSchema);
