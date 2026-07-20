import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserName } from "@shared/models/User";
import { RootState } from "../store";

export interface ProfileSlice {
  username?: UserName;
  isAuth: boolean;
}

const initialState: ProfileSlice = {
  isAuth: false,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserName>) => {
      state.username = action.payload;
      state.isAuth = true;
    },
    clearProfile: (state) => {
      state.username = undefined;
      state.isAuth = false;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export const profileSelector = (state: RootState) => state.profile;
export default profileSlice.reducer;
