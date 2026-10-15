
const Favorite = require("../models/favorite_model");
const Hotel = require("../models/hotel_model");

const addFavorite = async (userId, hotelId) => {
  // 1. Check whether the hotel exists and is active.
  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true
  }).select("_id");

  if (!hotel) {
    const error = new Error("Hotel not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Check whether this favorite already exists.
  const existingFavorite = await Favorite.findOne({
    userId,
    hotelId
  });

  if (existingFavorite) {
    const error = new Error("Hotel is already in favorites");
    error.statusCode = 409;
    throw error;
  }

  // 3. Save the favorite in MongoDB.
  try {
    const favorite = await Favorite.create({
      userId,
      hotelId
    });

    return favorite;
  } catch (error) {
    // Handle a duplicate created by simultaneous requests.
    if (error.code === 11000) {
      const duplicateError = new Error(
        "Hotel is already in favorites"
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};



const getMyFavorites = async (userId) => {
  const favorites = await Favorite.find({ userId })
    .populate({
      path: "hotelId",
      match: { isActive: true },
      select: "name description address images amenities roomTypes"
    })
    .sort({ createdAt: -1 })
    .lean();

  // Exclude favorites whose hotels are no longer active.
  return favorites.filter((favorite) => favorite.hotelId !== null);
};



const removeFavorite = async (userId, hotelId) => {
  const favorite = await Favorite.findOneAndDelete({
    userId,
    hotelId
  });

  if (!favorite) {
    const error = new Error(
      "Hotel is not in your favorites"
    );
    error.statusCode = 404;
    throw error;
  }

  return favorite;
};



module.exports = { addFavorite, getMyFavorites, removeFavorite };
