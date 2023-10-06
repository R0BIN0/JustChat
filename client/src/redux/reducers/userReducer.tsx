import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../apis/IUser";

const initialState: Omit<IUser, "password"> = {
  name: "",
  email: "",
  pictureId: 1,
  online: false,
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action: PayloadAction<Omit<IUser, "password">>) {
      const { name, email, pictureId, online, _id } = action.payload;
      state.name = name;
      state.email = email;
      state.pictureId = pictureId;
      state.online = online;
      state._id = _id;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
