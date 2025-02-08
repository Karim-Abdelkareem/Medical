import Cart from "../database/models/cart.model.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, price } = req.body;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity, price }] });
        } 
        // else {
        //     const item = cart.items.find(i => i.productId.toString() === productId);
        //     if (item) {
        //         item.quantity += quantity;
        //     } else {
        //         cart.items.push({ productId, quantity, price });
        //     }
        // }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        await Cart.updateOne({ userId }, { $pull: { items: { productId } } });
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        await Cart.updateOne(
            { userId, 'items.productId': productId },
            { $set: { 'items.$.quantity': quantity } }
        );
        res.status(200).json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
        res.status(200).json(cart || { userId: req.params.userId, items: [], totalPrice: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        await Cart.deleteOne({ userId: req.params.userId });
        res.status(200).json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};