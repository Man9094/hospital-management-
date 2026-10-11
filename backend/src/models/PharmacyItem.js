const mongoose = require("mongoose");

const BatchSchema = new mongoose.Schema(
  {
    batch_number: {
      type: String,
      required: true,
    },
    expiry_date: {
      type: String,
      required: true,
      index: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    purchase_price: {
      type: Number,
      required: true,
    },
    stock_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const PharmacyItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    item_code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    brand_name: {
      type: String,
      required: true,
      trim: true,
    },
    generic_name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    hsn_code: String,
    gst_rate: {
      type: Number,
      default: 12.0,
    },
    reorder_level: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      default: "active",
    },
    batches: [BatchSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.itemId || ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

PharmacyItemSchema.pre("save", async function (next) {
  if (!this.itemId) {
    const highest = await this.constructor.findOne().sort("-itemId");
    this.itemId = highest && highest.itemId ? highest.itemId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("PharmacyItem", PharmacyItemSchema);
