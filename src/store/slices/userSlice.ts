import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  isLogged: boolean;
}

const initialState: IUser = {
  isLogged: true,
};

export const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
  },
});

export const { login } = userSlice.actions;

export default userSlice.reducer;
