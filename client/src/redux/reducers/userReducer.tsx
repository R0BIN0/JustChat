import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../apis/IUser";

const initialState: Omit<IUser, "password"> = {
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action: PayloadAction<Omit<IUser, "password">>) {
      const { name, email } = action.payload;
      state.name = name;
      state.email = email;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
