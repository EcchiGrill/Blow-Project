import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  isLogged: boolean;
  username: string;
}

const initialState: IUser = {
  isLogged: true,
  username: "John Doe",
};

export const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLogged: action.payload,
      };
    },
  },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
