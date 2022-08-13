import { IShoppingCart } from "../models/ShoppingCart.model";
import { IUser } from "../models/User.model";
import Order from "../models/Order.model";

const create = async (shoppingCart: IShoppingCart, user: IUser) => {
  console.log("At Order service: ", shoppingCart);
  console.log("From user: ", user);

  let order = await Order.findOne({
    user: user._id,
    shoppingCart: shoppingCart._id,
  });

  if (order) {
    return null;
  }

  order = new Order({ shoppingCart, user });
  order.items = shoppingCart.items;
  await order.save();

  return order;
};

const allOrders = async (user: IUser) => {
  return Order.find({ user: user._id });
};

export default { create, allOrders };
