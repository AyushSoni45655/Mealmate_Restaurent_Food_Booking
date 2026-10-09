import CartModal from "../model/cart.modal.js";

const addToCart = async (req, res) => {
  try {
    console.log("I am hitted",req.body);
    
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Authentication required!"
      });
    }

    let { quantity, product } = req.body;

    if (!quantity || !product) {
      return res.status(400).json({
        success: false,
        msg: "Quantity and productId are required"
      });
    }

    quantity = Number(quantity);

    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        msg: "Quantity must be a valid number greater than 0"
      });
    }

    // Find user's cart
    let cart = await CartModal.findOne({
      user: userId
    });

    // Cart doesn't exist
    if (!cart) {
      cart = await CartModal.create({
        user: userId,
        items: [
          {
            product,
            quantity
          }
        ]
      });

      return res.status(201).json({
        success: true,
        msg: "Item added to cart successfully",
        cart
      });
    }

    // Check if product already exists
    const existingItem = cart.items.find(
      item => item.product.toString() === product.toString()
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product,
        quantity
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      msg: "Item added to cart successfully",
      cart
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      msg: `Add To Cart Error: ${e.message}`
    });
  }
};

const getCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "Authentication failed",
      });
    }

    const cart = await CartModal.findOne({ user: userId }).populate({
      path: "items.product",
      // select: "name price image", // chaho to product ke fields limit karo
    });

    // cart nahi mila to empty response
    if (!cart) {
      return res.status(200).json({
        success: true,
        msg: "Cart is empty",
        cart: { items: [] },
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Fetched cart items",
      cart, // items: [{ product: {...full product}, quantity }]
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      msg: `Cart Fetch Error: ${e.message}`,
    });
  }
};

export {addToCart,getCartItem}