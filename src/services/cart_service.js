
const mongoose = require("mongoose");

const Cart = require("../models/cart_model");
const Hotel = require("../models/hotel_model");

const addCartItem = async (userId, data) => {
  const {
    hotelId,
    roomTypeId,
    checkIn,
    checkOut,
    rooms,
    guests
  } = data;

  // 1. Validate IDs
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(hotelId) ||
    !mongoose.isValidObjectId(roomTypeId)
  ) {
    const error = new Error("Invalid user, hotel, or room type ID");
    error.statusCode = 400;
    throw error;
  }

  // 2. Validate date format: YYYY-MM-DD
  const isValidDateFormat = (value) =>
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
    new Date(`${value}T00:00:00.000Z`)
      .toISOString()
      .startsWith(value);

  if (!isValidDateFormat(checkIn) || !isValidDateFormat(checkOut)) {
    const error = new Error(
      "Check-in and check-out must use YYYY-MM-DD format"
    );
    error.statusCode = 400;
    throw error;
  }

  const checkInDate = new Date(`${checkIn}T00:00:00.000Z`);
  const checkOutDate = new Date(`${checkOut}T00:00:00.000Z`);

  if (checkOutDate <= checkInDate) {
    const error = new Error("Check-out must be after check-in");
    error.statusCode = 400;
    throw error;
  }

  // 3. Validate room and guest counts
  if (
    !Number.isInteger(rooms) ||
    rooms < 1 ||
    !Number.isInteger(guests) ||
    guests < 1
  ) {
    const error = new Error(
      "Rooms and guests must be positive whole numbers"
    );
    error.statusCode = 400;
    throw error;
  }

  // 4. Find the active hotel
  const hotel = await Hotel.findOne({
    _id: hotelId,
    isActive: true
  });

  if (!hotel) {
    const error = new Error("Hotel not found");
    error.statusCode = 404;
    throw error;
  }

  // 5. Find the selected embedded room type
  const roomType = hotel.roomTypes.id(roomTypeId);

  if (!roomType) {
    const error = new Error("Room type not found");
    error.statusCode = 404;
    throw error;
  }

  // 6. Check guest capacity
  if (guests > roomType.maxGuests * rooms) {
    const error = new Error(
      "Guest count exceeds the selected rooms' capacity"
    );
    error.statusCode = 400;
    throw error;
  }

  if (rooms > roomType.totalRooms) {
    const error = new Error(
      "Requested rooms exceed the hotel's listed room count"
    );
    error.statusCode = 400;
    throw error;
  }

  // 7. Create a cart if the user doesn't have one
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: []
    });
  }

  // 8. Add item using the current database price
  cart.items.push({
    hotelId: hotel._id,
    roomTypeId: roomType._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    rooms,
    guests,
    pricePerNight: roomType.pricePerNight
  });

  await cart.save();

  return cart;
};

module.exports = { addCartItem };
