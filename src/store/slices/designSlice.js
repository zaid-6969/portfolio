import { createSlice } from "@reduxjs/toolkit";

export const defaultDesign = {
  // Colors
  backgroundColor: "#0f172a",
  textColor: "#e2e8f0",
  buttonColor: "#6366f1",
  buttonTextColor: "#ffffff",
  tagColor: "#6366f1",

  // Typography — per element
  titleFontSize: "2rem",
  titleFontWeight: "800",
  titleFontFamily: "Syne, sans-serif",

  descFontSize: "1rem",
  descFontFamily: "DM Sans, sans-serif",
  descFontWeight: "400",

  tagFontSize: "0.75rem",

  // Layout
  borderRadius: "16px",
  boxShadow: "0px 20px 60px rgba(0,0,0,0.4)",
  border: "1px solid rgba(255,255,255,0.08)",
  padding: "32px",

  // Image
  imageSize: "full",       // full | large | medium | small | hidden
  imagePosition: "top",    // top | left | right | bottom
  imageHeight: "400",      // px number string

  // Accent / card width
  accentColor: "#6366f1",
};

const designSlice = createSlice({
  name: "design",
  initialState: {
    config: { ...defaultDesign },
    previewMode: "desktop",
  },
  reducers: {
    updateDesignConfig: (state, action) => {
      state.config = { ...state.config, ...action.payload };
    },
    resetDesignConfig: (state) => {
      state.config = { ...defaultDesign };
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