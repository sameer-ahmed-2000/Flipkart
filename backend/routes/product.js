const express = require('express');
const router = express.Router();
const zod=require("zod");
require('dotenv').config();
const jwt= require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const signupSchema=zod.object({
    username: zod.string().email(),
    fullName: zod.string(),
    password: zod.string(),
    
})

router.post('/signup',async (req,res)=>{
    try {
        const body=req.body;
        const {success,error}=signupSchema.safeParse(body);
        if (!success) {
            return res.status(400).json({
                message: "Incorrect inputs",
                errors: error.issues
            });
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                email: body.email
            }
        })
        if (existingUser) {
            c.status(409)
            return c.json({
                message: "Email is already taken"

            })
        }
        const hashedPassword = await hashPassword(body.password);
        const user = await prisma.user.create({

            data: {
                name: body.name,
                email: body.email,
                password: hashedPassword,
            }

        })
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ id: user.id, jwt });
    } catch (error) {
        res.status(500);
        return res.json({
            message:'Internal server error',error
        })
    } finally{
        prisma.$disconnect()
    }
})

module.exports= router;