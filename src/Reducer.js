import axios from "axios";

export const initialState = {
  basket:
    localStorage.getItem("cart") == null
      ? []
      : JSON.parse(localStorage.getItem("cart")),
  user: null,
};

// Selector
export const getBasketTotal = (basket) =>
  basket?.reduce((amount, item) => item.price * item.qty + amount, 0);

export const getCart = () => initialState.basket;

const Reducer = (state, action) => {
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
        temp = [...state.basket];
        var tempObj = temp[indexAdd];
        if (tempObj.qty < 10) {
          tempObj.qty = tempObj.qty + 1;
        } else {
          tempObj.qty = 10;
        }
        temp[indexAdd] = tempObj;
      } else {
        var tempobj = action.item;
        tempobj.qty = 1;
        temp = [...state.basket, tempobj];
      }
      localStorage.setItem("cart", JSON.stringify(temp));
      updateCart(temp);
      return {
        ...state,
        basket: temp,
      };

    case "UPDATE_FROM_BASKET":
      const indexUpdate = state.basket.findIndex(
        (basketItem) => basketItem._id === action.item._id
      );
      var temp = [...state.basket];
      temp[indexUpdate] = action.item;
      localStorage.setItem("cart", JSON.stringify(temp));
      updateCart(temp);
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
      updateCart(newBasket);
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

  function updateCart(obj) {
    if (localStorage.getItem("uid")) {
      var baseURL =
        (process.env.REACT_APP_API_URL !== undefined
          ? process.env.REACT_APP_API_URL
          : "") + "/api/";
      axios
        .put(
          baseURL +
            "mongoclient/updateone?collection=cart&id=" +
            localStorage.getItem("uid"),
          { cart: obj }
        )
        .then(
          (response) => {
            // console.log(response.data);
          },
          (error) => {
            // console.log(error);
          }
        );
    }
  }

  function getCartAPI() {
    if (localStorage.getItem("uid")) {
      var baseURL =
        (process.env.REACT_APP_API_URL !== undefined
          ? process.env.REACT_APP_API_URL
          : "") + "/api/";
      axios
        .post(
          baseURL +
            "mongoclient/id?collection=cart&id=" +
            localStorage.getItem("uid"),
          {}
        )
        .then(
          (response) => {
            console.log(response.data);
            localStorage.setItem("cart", response.data.cart);
            return response.data.cart;
          },
          (error) => {
            console.log(error);
            return [];
          }
        );
    }
  }
    
};

export default Reducer;
