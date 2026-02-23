import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
)

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['pg', 'tiffin', 'cook'],
    },
    category: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    subArea: String,
    address: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    contact: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    email: String,
    description: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    amenities: [String],
    foodType: {
      type: String,
      enum: ['Vegetarian', 'Non-Vegetarian', 'Both'],
      required: true,
    },
    images: [String],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    googleMapsLink: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'rejected'],
      default: 'active',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Calculate average rating
resourceSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = (total / this.reviews.length).toFixed(1)
    this.numReviews = this.reviews.length
  }
  next()
})

// Generate WhatsApp link
resourceSchema.methods.getWhatsAppLink = function () {
  const number = this.whatsappNumber.replace(/\D/g, '')
  const message = encodeURIComponent(`Hi! I'm interested in your ${this.type} - ${this.name}`)
  return `https://wa.me/91${number}?text=${message}`
}

// Generate Google Maps link
resourceSchema.methods.getGoogleMapsLink = function () {
  if (this.googleMapsLink) return this.googleMapsLink
  if (this.location.coordinates[0] !== 0) {
    const [lng, lat] = this.location.coordinates
    return `https://www.google.com/maps?q=${lat},${lng}`
  }
  return `https://www.google.com/maps/search/${this.area}+${this.subArea || ''}`
}

const Resource = mongoose.model('Resource', resourceSchema)

export default Resource
