import cashFlow, { getHeaders } from "../../apis/cashFlow";

import { CREATE_EXCEPTION } from "../types";

export const createException = (exception) => (dispatch, getState) => {
  return cashFlow
    .post("/exceptions", exception, {
      headers: getHeaders(getState().auth.user.token),
    })
    .then((res) => {
      dispatch({ type: CREATE_EXCEPTION, payload: res.data });
      return res.data;
    })
    .catch((error) => {
      return error.response.data;
    });
};
