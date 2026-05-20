

export const initialState = {
  price: [0, 10000],

  availability: "All",

  color: "All",
  size: "All",
  category: "All",
  activeFilterOnSale: false,
  brands: [],
  brands: [],
  filtered: [],
  sortingOption: "Sort by (Default)",
  sorted: [],
  totalProducts: 0,
  currentPage: 1,
  itemPerPage: 16,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_PRICE":
      return { ...state, price: action.payload };

    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_SIZE":
      return { ...state, size: action.payload };
    case "SET_AVAILABILITY":
      return { ...state, availability: action.payload };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "SET_BRANDS":
      return { ...state, brands: action.payload };
    case "SET_FILTERED":
      return { ...state, filtered: [...action.payload] };
    case "SET_TOTAL_PRODUCTS":
      return { ...state, totalProducts: action.payload };
    case "SET_SORTING_OPTION":
      return { ...state, sortingOption: action.payload };
    case "SET_SORTED":
      return { ...state, sorted: [...action.payload] };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "TOGGLE_FILTER_ON_SALE":
      return { ...state, activeFilterOnSale: !state.activeFilterOnSale };
    case "SET_ITEM_PER_PAGE":
      return { ...state, itemPerPage: action.payload };
    case "CLEAR_FILTER":
      return {
        ...state,
        price: [20, 300],

        availability: "All",

        color: "All",
        size: "All",
        category: "All",

        brands: [],
        activeFilterOnSale: false,
      };
    default:
      return state;
  }
}