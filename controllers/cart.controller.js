import Cart from "../database/models/cart.model.js";
import catchAsync from "../utils/catchAsync.js";
import productModel from "../database/models/product.model.js";
import AppError from "../utils/AppError.js";

function calculateTotal(cart) {
  let total = 0;
  cart.items.forEach((item) => {
    total += item.price * item.quantity;
  });
  cart.totalPrice = total;
}

export const addToCart = catchAsync(async (req, res, next) => {
  const { product: productId, quantity = 1 } = req.body;

  // Ensure quantity is valid
  if (quantity < 1) {
    return next(new AppError(400, "Quantity must be at least 1"));
  }

  // Check if product exists
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [{ product: product._id, quantity, price: product.price }],
    });
  } else {
    let existingItem = cart.items.find((item) =>
      item.product.equals(product._id)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: product._id, quantity, price: product.price });
    }
  }

  // Calculate and update total price
  calculateTotal(cart);

  await cart.save();

  res
    .status(200)
    .json({ message: "success", cart, ItemsNumber: cart.items.length });
});

export const removeFromCart = catchAsync(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError(404, "Cart not found"));
  }

  let itemIndex = cart.items.findIndex((item) =>
    item.product.equals(req.params.itemId)
  );

  if (itemIndex === -1) {
    return next(new AppError(404, "Item not found in the cart"));
  }

  if (cart.items[itemIndex].quantity > 1) {
    cart.items[itemIndex].quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  calculateTotal(cart);
  await cart.save();

  res
    .status(200)
    .json({ message: "success", cart, ItemsNumber: cart.items.length });
});

export const getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "-__v"
  );
  if (!cart) {
    return res
      .status(200)
      .json({ userId: req.user._id, items: [], totalPrice: 0 });
  }
  res
    .status(200)
    .json({ message: "success", cart, ItemsNumber: cart.items.length });
});
