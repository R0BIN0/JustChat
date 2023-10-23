import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserDTO } from "../../apis/IUserDTO";

const initialState: IUserDTO = {
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
    setUser(state, action: PayloadAction<IUserDTO>) {
      for (const [key, value] of Object.entries(action.payload)) {
        state[key as keyof IUserDTO] = value as never;
      }
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
