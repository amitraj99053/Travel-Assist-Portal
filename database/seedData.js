// Seed data for development/testing
const seedData = {
  users: [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'user@example.com',
      phone: '+91-9876543210',
      password: 'password123',
      role: 'user',
      address: { city: 'Delhi', state: 'Delhi', country: 'India' },
    },
    {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'mechanic1@example.com',
      phone: '+91-9876543211',
      password: 'password123',
      role: 'mechanic',
      address: { city: 'Delhi', state: 'Delhi', country: 'India' },
    },
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      phone: '+91-9876543212',
      password: 'password123',
      role: 'admin',
    },
  ],
  mechanics: [
    {
      licenseNumber: 'DL-2021-123456',
      licenseExpiry: new Date('2025-12-31'),
      skills: ['engine', 'transmission', 'brake'],
      yearsOfExperience: 5,
      shopName: 'Rajesh Auto Repair',
      shopAddress: 'Near Delhi Gate, Delhi',
      isVerified: true,
    },
  ],
};

module.exports = seedData;
