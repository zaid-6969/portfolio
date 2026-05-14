import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import authReducer from "./slices/authSlice";
import designReducer from "./slices/designSlice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    auth: authReducer,
    design: designReducer,
  },
});

export default store;