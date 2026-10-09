import { createSlice, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import createApiThunk from '../../../utils/customApiThunk';

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const route = localStorage.getItem("layout");
const email = localStorage.getItem("email");

const initialState = {
  token: token || "",
  uError: null,
  uSuccess: null,
  email: email || "",
  uLoading: false,
  defaultRoute: route || "customer",
  user: user ? JSON.parse(user) : {},
  users: []            // localStorage se nahi, sirf memory me
};

export const signUp = createApiThunk("user/signup", 'post', `/user/signup`);
export const signIn = createApiThunk("user/signin", 'post', '/user/signin');
export const forgetPassword = createApiThunk("user/forget-password", 'post', '/user/forgot-password');
export const fPasswordOtpVerify = createApiThunk("user/forget-otp-verify", 'post', '/user/forgot-verify-otp');
export const setPassword = createApiThunk("user/forget-set-password", 'post', '/user/forgot-set-password');
export const signUpVerification = createApiThunk("user/signup-otp-verify", 'post', `/user/signup-verify`);
export const getAllUsers = createApiThunk("user/all-users", 'get', `/user/all-users`);
export const logOutUser = createApiThunk("user/log-out", 'post', `/user/user-logout`); // POST

const apiThunk = [signUp, signIn, forgetPassword, fPasswordOtpVerify, setPassword, signUpVerification, getAllUsers, logOutUser];

const clearSession = (state) => {
  state.token = "";
  state.user = {};
  state.users = [];
  state.email = "";
  state.defaultRoute = "customer";
  localStorage.clear();
  sessionStorage.clear();
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload;
      localStorage.setItem('email', action.payload);
    },
    cleanUserMsg(state) {
      state.uError = null;
      state.uSuccess = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        const { user, accessToken, msg } = action.payload;
        state.uSuccess = msg;
        state.token = accessToken;
        state.user = user;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(signUpVerification.fulfilled, (state, action) => {
        const { msg, user } = action.payload;
        state.uSuccess = msg;
        state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(signIn.fulfilled, (state, action) => {
        const { msg, user, accessToken } = action.payload;
        state.uSuccess = msg;
        state.user = user;
        state.token = accessToken;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.uSuccess = action.payload.msg;
      })
      .addCase(fPasswordOtpVerify.fulfilled, (state, action) => {
        state.uSuccess = action.payload.msg;
      })
      .addCase(setPassword.fulfilled, (state, action) => {
        state.uSuccess = action.payload.msg;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        const { msg, users } = action.payload;
        state.uSuccess = msg;
        state.users = users;
      })
      // logout: success ho ya fail, local session clear
      .addCase(logOutUser.fulfilled, (state, action) => {
        clearSession(state);
        state.uSuccess = action.payload.msg;
      })
      .addCase(logOutUser.rejected, (state) => {
        clearSession(state);
      })
      .addMatcher(isPending(...apiThunk), (state) => {
        state.uLoading = true;
        state.uSuccess = null;
        state.uError = null;
      })
      .addMatcher(isFulfilled(...apiThunk), (state) => {
        state.uLoading = false;
      })
      .addMatcher(isRejected(...apiThunk), (state, action) => {
        state.uLoading = false;
        state.uSuccess = null;
        // logout fail pe error dikhana zaroori nahi
        if (!logOutUser.rejected.match(action)) {
          state.uError = action.payload;
        }
      });
  }
});

export const { cleanUserMsg, setEmail } = userSlice.actions;
export default userSlice.reducer;