const express = require('express');
const router = express.Router();
const zod = require("zod");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware');
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

// GET all products
router.get('/items', async (req, res) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = 9; // Number of items per page

        if (page < 1) {
            return res.status(400).json({ message: "Page number must be 1 or higher" });
        }

        // Calculate the offset
        const offset = (page - 1) * limit;

        // Fetch products with pagination
        const products = await prisma.product.findMany({
            skip: offset,
            take: limit,
        });

        // Calculate the discount percentage for each product
        const productsWithDiscount = products.map(product => {
            const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            return {
                ...product,
                discountPercentage: `${discountPercentage}% Off`,
            };
        });

        // Get total number of products for pagination info
        const totalProducts = await prisma.product.count();

        res.status(200).json({
            products: productsWithDiscount,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            totalItems: totalProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    } finally {
        prisma.$disconnect();
    }
});


// GET a specific product by ID
router.get('/item/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id: id },
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }

        // Calculate the discount percentage for the specific product
        const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);

        const productWithDiscount = {
            ...product,
            discountPercentage: `${discountPercentage}% Off`,
        };

        res.status(200).json(productWithDiscount);
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    } finally {
        prisma.$disconnect();
    }
});


const addToCartSchema = zod.object({
    productId: zod.string(),
    quantity: zod.number().min(1).optional(),
});

router.post('/cart/add/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const quantity = parseInt(req.query.quantity) || 1; // Default to 1 if not provided

        // Validate quantity
        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }

        // Check if the cart exists for the user
        let cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: { items: true },
        });

        if (!cart) {
            // If no cart exists, create a new cart for the user
            cart = await prisma.cart.create({
                data: {
                    userId: req.userId,
                    items: {
                        create: {
                            productId,
                            quantity,
                        },
                    },
                },
            });
        } else {
            // Check if the product is already in the cart
            const existingCartItem = cart.items.find(item => item.productId === productId);

            if (existingCartItem) {
                // Respond with a message indicating the item is already in the cart
                return res.status(400).json({ message: "Product already in cart" });
            } else {
                // Add the new item to the cart
                await prisma.cartItem.create({
                    data: {
                        productId,
                        quantity,
                        cartId: cart.id,
                    },
                });
            }
        }

        res.status(200).json({ message: "Item added to cart successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    } finally {
        prisma.$disconnect();
    }
});

router.delete('/cart/remove/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the user's cart first
        const cart = await prisma.cart.findUnique({
            where: {
                userId: req.userId,
            },
            include: {
                items: true,
            }
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the cart item with the specified productId
        const cartItem = cart.items.find(item => item.productId === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Remove the item from the cart
        await prisma.cartItem.delete({
            where: { id: cartItem.id }
        });

        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        prisma.$disconnect();
    }
});


router.put('/cart/update/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (quantity == null || quantity < 0) {
            return res.status(400).json({ message: 'Quantity is required and must be a positive number' });
        }

        // Find the user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: { items: true },
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the specific cart item
        const cartItem = cart.items.find(item => item.productId === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            // Remove the item if quantity is set to 0 or less
            await prisma.cartItem.delete({
                where: { id: cartItem.id }
            });
            return res.status(200).json({ message: 'Item removed from cart' });
        } else {
            // Update the quantity
            await prisma.cartItem.update({
                where: { id: cartItem.id },
                data: { quantity: quantity }
            });
            return res.status(200).json({ message: 'Item quantity updated successfully' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        prisma.$disconnect();
    }
});


router.get('/cart/details', authMiddleware, async (req, res) => {
    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        // Calculate the subtotal, discount, and total, and add discount percentage to each item
        let subtotal = 0;
        const cartItemsWithDiscount = cart.items.map(item => {
            const { product } = item;
            const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;

            return {
                productId: product.id,
                productName: product.title,
                productImage: product.images[0],
                productPrice: product.price,
                mrp: product.mrp,
                quantity: item.quantity,
                itemTotal,
                discountPercentage: `${discountPercentage}% Off`,
            };
        });

        const totalItems = cart.items.length; // Number of different products
        const total = subtotal; // Since no additional discounts are applied

        res.status(200).json({
            items: cartItemsWithDiscount,
            totalItems,
            subtotal,
            total,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    } finally {
        prisma.$disconnect();
    }
});

router.post('/cart/checkout', authMiddleware, async (req, res) => {
    try {
        // Fetch the cart and related items for the user
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: { items: { include: { product: true } } }, // Ensure we include the related Product
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or not found' });
        }

        // Calculate total amount and create history items
        let totalAmount = 0;
        const historyItems = cart.items.map((item) => {
            if (!item.product || !item.product.price) {
                throw new Error('Product price not found for one of the cart items');
            }

            const priceAtPurchase = item.product.price * item.quantity;
            totalAmount += priceAtPurchase;

            return {
                productId: item.productId,
                productTitle: item.product.title,
                quantity: item.quantity,
                priceAtPurchase: item.product.price,
            };
        });

        // Create a history record
        const history = await prisma.history.create({
            data: {
                userId: req.userId,
                cartId: cart.id,
                totalAmount: totalAmount,
                items: {
                    createMany: {
                        data: historyItems,
                    },
                },
            },
        });

        // Remove the items from the cart
        await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        res.status(200).json({
            message: 'Checkout successful and history recorded',
            historyId: history.id,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        prisma.$disconnect();
    }
});


router.get('/history', authMiddleware, async (req, res) => {
    try {
        // Fetch the history records for the logged-in user
        const history = await prisma.history.findMany({
            where: { userId: req.userId },
            include: {
                items: true, // Include the associated HistoryItem records
            },
            orderBy: { processedAt: 'desc' }, // Order by most recent purchases
        });

        if (history.length === 0) {
            return res.status(404).json({ message: 'No purchase history found' });
        }

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    } finally {
        prisma.$disconnect();
    }
});

module.exports = router;