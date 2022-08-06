import ShoppingCart, {
  IShoppingCart,
  IShoppingCartItem,
} from "../models/ShoppingCart.model";
import { IUser } from "../models/User.model";

const create = async (data: { user: IUser; items: IShoppingCartItem[] }) => {
  let shoppingCart = await ShoppingCart.findOne({ user: data.user._id });
  const shoppingCartData: IShoppingCart = data;

  if (!shoppingCart) {
    shoppingCart = new ShoppingCart(shoppingCartData);
    shoppingCart.save();
  } else {
    shoppingCart = await update({
      id: shoppingCart._id,
      user: data.user,
      items: shoppingCartData.items,
    });
  }

  return shoppingCart;
};

const update = async (data: {
  id: string;
  user: IUser;
  items: IShoppingCartItem[];
}) => {
  const shoppingCart = await ShoppingCart.findOne({
    user: data.user._id,
    _id: data.id,
  });

  if (!shoppingCart) {
    return null;
  }

  data.items.forEach((item: IShoppingCartItem) => {
    let cartItem = shoppingCart.items.find((i) => i.product == item.product);
    if (!cartItem) {
      if (item.qty > 0) {
        shoppingCart.items.push(item);
      }
    } else if (cartItem && item.qty <= 0) {
      shoppingCart.items = shoppingCart.items.filter(
        (i) => i.product != item.product
      );
    } else {
      cartItem.qty = item.qty;
    }
  });
  await shoppingCart.save();
  return shoppingCart;
};

const remove = async (user: IUser) => {
  return ShoppingCart.deleteOne({
    user: user._id,
  });
};

export default { create, update, remove };
