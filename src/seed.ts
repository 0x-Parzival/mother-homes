import dbConnect from "./db/db.connect.js";
import User from "./entities/User.entitiy.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

async function seedSuperAdmin() {
  try {
    await dbConnect();
    console.log("Connected to database");

    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({ role: "superadmin" });
    if (existingSuperAdmin) {
      console.log("Superadmin already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    // Create superadmin user
    const superAdmin = new User({
      User_Name: "Super Admin",
      email: "superadmin@motherhomes.com",
      password: hashedPassword,
      role: "superadmin",
      isVerified: true,
      phone_no: 1234567890,
      otp: "",
    });

    await superAdmin.save();
    console.log("Superadmin created successfully");
    console.log("Email: superadmin@motherhomes.com");
    console.log("Password: superadmin123");
  } catch (error) {
    console.error("Error seeding superadmin:", error);
  } finally {
    process.exit(0);
  }
}

seedSuperAdmin();
