const Cart = require("../models/cart.js");

// Add item to cart or update item quantity
const addToCart = async (req, res) => {
  const { username, productId, size, quantity } = req.body;

  if (!username || !productId || !size || quantity === undefined) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Find user's cart
    let cart = await Cart.findOne({ username });

    if (!cart) {
      // Create new cart if not exists
      cart = new Cart({
        username,
        items: [{ productId, size, quantity }],
      });
    } else {
      // Check if the item already exists in the cart
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId && item.size === size
      );

      if (itemIndex > -1) {
        // If item exists, update quantity
        cart.items[itemIndex].quantity += quantity;
      } else {
        // Else, add new item
        cart.items.push({ productId, size, quantity });
      }
    }

    // Save the cart
    await cart.save();
    res.status(200).json({ success: true, message: "Item added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get cart items for a user
const getCart = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    // Find user's cart
    const cart = await Cart.findOne({ username });

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Remove an item from the cart
const removeFromCart = async (req, res) => {
  const { username, productId, size } = req.body;

  if (!username || !productId || !size) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const cart = await Cart.findOne({ username });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Remove the item matching productId and size
    cart.items = cart.items.filter(
      (item) => item.productId !== productId || item.size !== size
    );

    // Save the updated cart
    await cart.save();
    res.status(200).json({ success: true, message: "Item removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Clear the cart for a user
const clearCart = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }

  try {
    const cart = await Cart.findOne({ username });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    cart.items = []; // Clear all items
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
};
