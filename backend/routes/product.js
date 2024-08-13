const express = require('express');
const router = express.Router();
const zod = require("zod");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Zod schema for validation
const productSchema = zod.object({
    category: zod.string(),
    brand: zod.string(),
    title: zod.string(),
    subTitle: zod.string().optional(),
    highlights: zod.array(zod.string()).optional(),
    mrp: zod.number(),
    price: zod.number(),
    averageRating: zod.number(),
    ratingCount: zod.number(),
    reviewCount: zod.number(),
    images: zod.array(zod.string()).optional(),
});

router.post('/item', async (req, res) => {
    try {
        const body = req.body;

        // Validation for the input with Zod schema
        const result = productSchema.safeParse(body);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: result.error.issues,
            });
        }

        // Creating the product in the database
        const product = await prisma.product.create({
            data: {
                category: body.category,
                brand: body.brand,
                title: body.title,
                subTitle: body.subTitle,
                highlights: body.highlights || [],
                mrp: body.mrp,
                price: body.price,
                averageRating: body.averageRating,
                ratingCount: body.ratingCount,
                reviewCount: body.reviewCount,
                images: body.images || [],
            },
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    } finally {
        prisma.$disconnect();
    }
});

module.exports = router;