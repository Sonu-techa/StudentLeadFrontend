import { db } from "./server/db";
import { users } from "./shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "admin")
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const [admin] = await db.insert(users).values({
      username: "admin",
      password: await hashPassword("admin123"),
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log("Admin user created successfully:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();