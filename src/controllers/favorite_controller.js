
const { addFavorite, getMyFavorites } = require("../services/favorite_service");

const addFavoriteController = async (req, res, next) => {
  try {
    const favorite = await addFavorite(
      req.user.id,
      req.params.hotelId
    );

    return res.status(201).json({
      success: true,
      message: "Hotel added to favorites",
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};


const getMyFavoritesController = async (req, res, next) => {
  try {
    const favorites = await getMyFavorites(req.user.id);

    return res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    next(error);
  }
};


module.exports = { addFavoriteController, getMyFavoritesController };
