import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
        }
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
});

cartSchema.pre('save', function(next) {
    this.totalPrice = this.items.reduce((total, item) => total + item.quantity * item.price, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;