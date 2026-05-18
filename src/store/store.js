import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import authReducer from "./slices/authSlice";
import designReducer from "./slices/designSlice";
import themeReducer from "./slices/ThemeSlice";
import draftReducer from "./slices/Draftslice";

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    auth: authReducer,
    design: designReducer,
    theme: themeReducer,
    draft: draftReducer,
  },
});

export default store;