const express = require('express');
const router = express.Router();
const zod = require("zod");
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { authMiddleware } = require('../middleware');
const prisma = new PrismaClient();

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
        const result = productSchema.safeParse(body);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid input data",
                errors: result.error.issues,
            });
        }
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
router.get('/items', async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        if (page < 1) {
            return res.status(400).json({ message: "Page number must be 1 or higher" });
        }
        const offset = (page - 1) * limit;
        const products = await prisma.product.findMany({
            skip: offset,
            take: limit,
        });
        const productsWithDiscount = products.map(product => {
            const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
            return {
                ...product,
                discountPercentage: `${discountPercentage}% Off`,
            };
        });
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
        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }
        let cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: { items: true },
        });

        if (!cart) {
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
            const existingCartItem = cart.items.find(item => item.productId === productId);

            if (existingCartItem) {
                return res.status(400).json({ message: "Product already in cart" });
            } else {
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
        const cartItem = cart.items.find(item => item.productId === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
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
        if (quantity == null || quantity < 0) {
            return res.status(400).json({ message: 'Quantity is required and must be a positive number' });
        }
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: { items: true },
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItem = cart.items.find(item => item.productId === productId);

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            await prisma.cartItem.delete({
                where: { id: cartItem.id }
            });
            return res.status(200).json({ message: 'Item removed from cart' });
        } else {
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
            return res.status(200).json([]);
        }
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

        const totalItems = cart.items.length;
        const total = subtotal;

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
        const cart = await prisma.cart.findUnique({
            where: { userId: req.userId },
            include: { items: { include: { product: true } } },
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty or not found' });
        }
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


module.exports = router;