import { LOGIN_SUCCESS, LOGOUT, UPDATEUSER } from "./actionType";

export const authReducer = (state = null, { type, payload, token }) => {
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        data: payload,
        token: token,
      };
    case LOGOUT:
      return payload;
    case UPDATEUSER:
      return {
        ...state,
        data: payload,
      };
    default:
      return state;
  }
};
