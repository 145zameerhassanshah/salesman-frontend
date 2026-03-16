import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  industry:string | null;
  phone_number:string;
  whatsapp_number:string;
  city:string;
  name: string;
  email: string;
  user_type: string;
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {

    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },

    clearUser(state) {
      state.user = null;
    },

  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;