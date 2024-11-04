// State type
type StateType = {
  isLoading: boolean;
  error: string | null;
};

// Action type
type ActionType =
  | { type: "REQUEST_START" }
  | { type: "REQUEST_SUCCESS" }
  | { type: "REQUEST_ERROR"; payload: string };

// Reducer function
const axiosReducer = (state: StateType, action: ActionType): StateType => {
  switch (action.type) {
    case "REQUEST_START":
      return { ...state, isLoading: true, error: null };
    case "REQUEST_SUCCESS":
      return { ...state, isLoading: false };
    case "REQUEST_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState: StateType = {
  isLoading: false,
  error: null,
};

export { axiosReducer, initialState };
export type { StateType, ActionType };
