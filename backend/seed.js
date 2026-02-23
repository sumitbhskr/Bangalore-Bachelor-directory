import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from './models/User.js'
import Resource from './models/Resource.js'

dotenv.config()

const sampleResources = [
  {
    name: 'Sunshine PG for Gents',
    type: 'pg',
    category: "Men's PG",
    area: 'HSR Layout',
    subArea: 'Sector 1',
    price: 8500,
    contact: '9876543210',
    whatsappNumber: '9876543210',
    description: 'Spacious rooms with attached bathroom, 3 meals included, 24/7 security, WiFi, AC',
    amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'Security'],
    foodType: 'Both',
    verified: true,
    featured: true,
    googleMapsLink: 'https://goo.gl/maps/hsr1',
  },
  {
    name: 'Comfort Ladies PG',
    type: 'pg',
    category: "Women's PG",
    area: 'HSR Layout',
    subArea: 'Sector 2',
    price: 9000,
    contact: '9876543211',
    whatsappNumber: '9876543211',
    description: 'Safe and secure PG with CCTV, mess facility, near metro station',
    amenities: ['WiFi', 'AC', 'Meals', 'Power Backup', 'CCTV'],
    foodType: 'Vegetarian',
    verified: true,
    featured: false,
  },
  {
    name: "Amma's Homely Tiffin",
    type: 'tiffin',
    category: 'Vegetarian Tiffin',
    area: 'HSR Layout',
    subArea: 'Sector 1',
    price: 3500,
    contact: '9876543222',
    whatsappNumber: '9876543222',
    description: 'Pure vegetarian home-cooked meals, monthly subscription available',
    amenities: ['Home Delivery', 'Breakfast', 'Lunch', 'Dinner'],
    foodType: 'Vegetarian',
    verified: true,
    featured: true,
  },
  {
    name: 'Lakshmi - Expert Cook',
    type: 'cook',
    category: 'Vegetarian Cook',
    area: 'HSR Layout',
    subArea: 'Sector 1',
    price: 6000,
    contact: '9876543231',
    whatsappNumber: '9876543231',
    description: '15 years experience, specializes in traditional South Indian breakfast',
    amenities: ['Vegetarian', 'North Indian', 'South Indian'],
    foodType: 'Vegetarian',
    verified: true,
    featured: true,
  },
  {
    name: 'Tech Hub Co-living',
    type: 'pg',
    category: 'Co-living PG',
    area: 'BTM Layout',
    subArea: 'Stage 1',
    price: 12000,
    contact: '9876543217',
    whatsappNumber: '9876543217',
    description: 'Modern coliving with dedicated workspace, high-speed internet',
    amenities: ['WiFi', 'AC', 'Gym', 'Coworking Space'],
    foodType: 'Both',
    verified: true,
    featured: true,
  },
  {
    name: 'Green Leaf Tiffin',
    type: 'tiffin',
    category: 'Vegetarian Tiffin',
    area: 'BTM Layout',
    subArea: 'Stage 2',
    price: 3800,
    contact: '9876543227',
    whatsappNumber: '9876543227',
    description: 'Organic ingredients, no preservatives, Jain food available',
    amenities: ['Home Delivery', 'Breakfast', 'Lunch', 'Dinner'],
    foodType: 'Vegetarian',
    verified: true,
    featured: false,
  },
  {
    name: 'Urban Nest PG',
    type: 'pg',
    category: "Men's PG",
    area: 'Koramangala',
    subArea: '5th Block',
    price: 11500,
    contact: '9876543218',
    whatsappNumber: '9876543218',
    description: 'Stylish PG in the heart of Koramangala, near pubs and cafes',
    amenities: ['WiFi', 'AC', 'Meals', 'Netflix'],
    foodType: 'Both',
    verified: true,
    featured: true,
  },
  {
    name: 'IT Park Residency',
    type: 'pg',
    category: "Men's PG",
    area: 'Whitefield',
    subArea: 'ITPL Main Road',
    price: 9000,
    contact: '9876543220',
    whatsappNumber: '9876543220',
    description: 'Close to IT parks, company shuttle pickup point nearby',
    amenities: ['WiFi', 'AC', 'Meals', 'Shuttle'],
    foodType: 'Both',
    verified: true,
    featured: false,
  },
  {
    name: 'Spice Route Tiffin Service',
    type: 'tiffin',
    category: 'Both Veg & Non-Veg',
    area: 'Koramangala',
    subArea: '6th Block',
    price: 4200,
    contact: '9876543223',
    whatsappNumber: '9876543223',
    description: 'Authentic North and South Indian cuisine, both veg and non-veg options',
    amenities: ['Home Delivery', 'Lunch', 'Dinner', 'Weekend Special'],
    foodType: 'Both',
    verified: true,
    featured: false,
  },
  {
    name: 'Ramu - Multi-Cuisine Cook',
    type: 'cook',
    category: 'Both Veg & Non-Veg',
    area: 'Koramangala',
    subArea: '7th Block',
    price: 8000,
    contact: '9876543232',
    whatsappNumber: '9876543232',
    description: 'Can cook multiple cuisines, available for parties and events',
    amenities: ['Both', 'Continental', 'Chinese', 'Party Cook'],
    foodType: 'Both',
    verified: true,
    featured: false,
  },
]

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...\n')

    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/bangalore-bachelor'
    )
    console.log('✅ Connected to MongoDB\n')

    // Clear existing data
    await Resource.deleteMany({})
    await User.deleteMany({})
    console.log('🗑️  Cleared existing data\n')

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bangalore.com',
      password: 'admin123',
      role: 'admin',
    })
    console.log('👤 Created admin user')
    console.log(`   Email: ${admin.email}`)
    console.log(`   Password: admin123\n`)

    // Create sample user
    const user = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      phone: '9999999999',
    })
    console.log('👤 Created test user')
    console.log(`   Email: ${user.email}`)
    console.log(`   Password: user123\n`)

    // Insert resources
    const resources = sampleResources.map(resource => ({
      ...resource,
      createdBy: user._id,
    }))

    const insertedResources = await Resource.insertMany(resources)
    console.log(`📦 Inserted ${insertedResources.length} resources\n`)

    // Add some reviews
    const resource1 = insertedResources[0]
    resource1.reviews.push({
      user: admin._id,
      userName: admin.name,
      rating: 5,
      comment: 'Excellent PG! Highly recommend.',
    })
    await resource1.save()

    console.log('📊 Database Statistics:')
    console.log(`   Total Resources: ${insertedResources.length}`)
    console.log(`   PGs: ${insertedResources.filter(r => r.type === 'pg').length}`)
    console.log(`   Tiffin Services: ${insertedResources.filter(r => r.type === 'tiffin').length}`)
    console.log(`   Cooks: ${insertedResources.filter(r => r.type === 'cook').length}`)
    console.log(`   Featured: ${insertedResources.filter(r => r.featured).length}\n`)

    console.log('✨ Database seeded successfully!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

seedDatabase()
