const express = require('express');
const router = express.Router();
const zod = require("zod");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const JWT_SECRET = process.env.JWT_SECRET;
const prisma = new PrismaClient();

// Zod schema for validating signup inputs
const signupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string(),
});

// Function to hash passwords using bcrypt
async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

// Route to handle user signup
router.post('/signup', async (req, res) => {
    try {
        const body = req.body;

        // Validate input using Zod schema
        const validation = signupSchema.safeParse(body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Incorrect inputs",
                errors: validation.error.issues
            });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findFirst({
            where: { email: body.email }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email is already taken"
            });
        }

        // Hash the user's password
        const hashedPassword = await hashPassword(body.password);

        // Create the new user
        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            }
        });

        // Generate a JWT token for the user
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        // Respond with the user ID and token
        return res.json({ id: user.id, token });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

// Zod schema for validating signin inputs
const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string(),
});

// Function to verify a password using bcrypt
async function verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

// Route to handle user signin
router.post('/signin', async (req, res) => {
    try {
        const body = req.body;

        // Validate input using Zod schema
        const validation = signinSchema.safeParse(body);
        if (!validation.success) {
            return res.status(400).json({
                message: "Incorrect inputs",
                errors: validation.error.issues
            });
        }

        // Check if the user exists and verify the password
        const user = await prisma.user.findFirst({
            where: { email: body.email }
        });
        if (!user || !(await verifyPassword(body.password, user.password))) {
            return res.status(401).json({
                message: "Invalid Email or Password"
            });
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ id: user.id }, JWT_SECRET);

        // Respond with the user ID and token
        return res.json({ id: user.id, token });

    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        await prisma.$disconnect();
    }
});

module.exports = router;
