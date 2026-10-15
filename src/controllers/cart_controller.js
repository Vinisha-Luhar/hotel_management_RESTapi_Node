
const { addCartItem } = require("../services/cart_service");

const addCartItemController = async (req, res, next) => {
  try {
    const cart = await addCartItem(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: { cart }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCartItemController
};
