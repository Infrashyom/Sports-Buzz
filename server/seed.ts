import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { School } from './models/School';
import { connectDB } from './config/db';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    console.log('Database connected for seeding');

    const password = await bcrypt.hash('password123', 12);

    // 1. Create Admin
    const adminEmail = 'admin@sportsbuzz.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password,
        role: 'ADMIN',
        status: 'Active',
      });
      console.log('Admin created');
    } else {
      console.log('Admin already exists');
    }

    // 2. Create School User and School
    const schoolEmail = 'school@springfield.edu';
    let schoolUser = await User.findOne({ email: schoolEmail });
    
    if (!schoolUser) {
      schoolUser = await User.create({
        name: 'Principal Skinner',
        email: schoolEmail,
        password,
        role: 'SCHOOL',
        status: 'Active',
      });
      console.log('School User created');

      const school = await School.create({
        name: 'Springfield High School',
        address: '742 Evergreen Terrace',
        contactEmail: schoolEmail,
        adminUserId: schoolUser._id,
        isSubscribed: true,
        paymentStatus: 'Paid',
        studentCount: 500,
        cityRank: 1,
        facilities: [
          { name: 'Main Gym', type: 'Gym', status: 'Available' },
          { name: 'Football Field', type: 'Field', status: 'Available' }
        ]
      });
      
      schoolUser.schoolId = school._id as unknown as mongoose.Types.ObjectId;
      await schoolUser.save();
      console.log('School created and linked');
    } else {
      console.log('School User already exists');
    }

    // 3. Create Referee
    const refereeEmail = 'referee@sportsbuzz.com';
    let referee = await User.findOne({ email: refereeEmail });
    if (!referee) {
      referee = await User.create({
        name: 'Coach Whistle',
        email: refereeEmail,
        password,
        role: 'REFEREE',
        status: 'Active',
        rating: 4.5,
        experience: '10 years',
        certifications: [{ name: 'FIFA Level 1', status: 'Verified' }],
        availability: true,
      });
      console.log('Referee created');
    } else {
      console.log('Referee already exists');
    }

    // 4. Create Student
    const studentEmail = 'student@springfield.edu';
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      // Find the school created above or just pick one if we didn't just create it
      // For simplicity, let's try to find the school user again to get the school ID
      const sUser = await User.findOne({ email: schoolEmail });
      
      student = await User.create({
        name: 'Bart Simpson',
        email: studentEmail,
        password,
        role: 'STUDENT',
        status: 'Active',
        schoolId: sUser?.schoolId,
      });
      console.log('Student created');
    } else {
      console.log('Student already exists');
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
