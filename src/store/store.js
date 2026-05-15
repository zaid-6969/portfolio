import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import authReducer from "./slices/authSlice";
import designReducer from "./slices/designSlice";
import themeReducer from "./slices/ThemeSlice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    auth: authReducer,
    design: designReducer,
    theme : themeReducer,
  },
});

export default store;