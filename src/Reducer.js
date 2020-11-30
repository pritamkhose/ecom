export const initialState = {
  basket:
    localStorage.getItem("cart") == null
      ? []
      : JSON.parse(localStorage.getItem("cart")),
  user: null,
};

// Selector
export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => item.price + amount, 0);

export const getCart = () => initialState.basket;

const Reducer = (state, action) => {
  // console.log(action);
  switch (action.type) {
    case "GET_BASKET":
      return {
        ...state,
        basket: [...state.basket],
      };

    case "ADD_TO_BASKET":
      const indexAdd = state.basket.findIndex(
        (basketItem) => basketItem._id === action.item._id
      );
      var temp = [];
      if (indexAdd >= 0) {
        let newBasket = [...state.basket];
        var tempobj = action.item;
        tempobj.qty = tempobj.qty + 1;
        temp = [...state.basket.splice(indexAdd, 1), tempobj];
      } else {
        var tempobj = action.item;
        tempobj.qty = 1;
        temp = [...state.basket, tempobj];
      }
      localStorage.setItem("cart", JSON.stringify(temp));
      return {
        ...state,
        basket: temp,
      };

    case "EMPTY_BASKET":
      localStorage.setItem("cart", []);
      return {
        ...state,
        basket: [],
      };

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem._id === action._id
      );
      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Cant remove product (id: ${action._id}) as its not in basket!`
        );
      }
      localStorage.setItem("cart", JSON.stringify(newBasket));
      return {
        ...state,
        basket: newBasket,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};

export default Reducer;
