import { createSlice } from "@reduxjs/toolkit";

const defaultDesign = {
  backgroundColor: "#0f172a",
  textColor: "#e2e8f0",
  fontSize: "16px",
  borderRadius: "16px",
  boxShadow: "0px 20px 60px rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "32px",
  buttonColor: "#6366f1",
  buttonTextColor: "#ffffff",
  accentColor: "#6366f1",
  fontFamily: "inherit",
};

const designSlice = createSlice({
  name: "design",
  initialState: {
    config: defaultDesign,
    previewMode: "desktop", // desktop | tablet | mobile
  },
  reducers: {
    updateDesignConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload };
    },
    resetDesignConfig: (state) => {
      state.config = defaultDesign;
    },
    setPreviewMode: (state, action) => {
      state.previewMode = action.payload;
    },
    loadDesignConfig: (state, action) => {
      state.config = { ...defaultDesign, ...action.payload };
    },
  },
});

export const { updateDesignConfig, resetDesignConfig, setPreviewMode, loadDesignConfig } = designSlice.actions;
export default designSlice.reducer;