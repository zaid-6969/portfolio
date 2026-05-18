import { createSlice } from "@reduxjs/toolkit";

// Stores the form data between Step 1 (form) and Step 2 (customizer)
const draftSlice = createSlice({
  name: "draft",
  initialState: {
    projectName: "",
    description: "",
    githubLink: "",
    deploymentLink: "",
    languages: [],
    tags: [],
    imagePreview: null, // base64 or object URL — for live preview
    imageFile: null,    // not stored in redux (File objects can't serialize) — kept in component state
    isEditing: false,
    editId: null,
  },
  reducers: {
    saveDraft: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearDraft: () => ({
      projectName: "", description: "", githubLink: "", deploymentLink: "",
      languages: [], tags: [], imagePreview: null, imageFile: null,
      isEditing: false, editId: null,
    }),
  },
});

export const { saveDraft, clearDraft } = draftSlice.actions;
export default draftSlice.reducer;