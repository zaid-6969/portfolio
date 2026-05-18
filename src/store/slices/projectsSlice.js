import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchProjects = createAsyncThunk("projects/fetchAll", async (_, { rejectWithValue }) => {
  try { const { data } = await API.get("/projects"); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to fetch"); }
});

export const createProject = createAsyncThunk("projects/create", async (formData, { rejectWithValue }) => {
  try { const { data } = await API.post("/projects", formData); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to create"); }
});

export const updateProject = createAsyncThunk("projects/update", async ({ id, formData }, { rejectWithValue }) => {
  try { const { data } = await API.put(`/projects/${id}`, formData); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to update"); }
});

export const deleteProject = createAsyncThunk("projects/delete", async (id, { rejectWithValue }) => {
  try { await API.delete(`/projects/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to delete"); }
});

const projectsSlice = createSlice({
  name: "projects",
  initialState: { items: [], loading: false, error: null, selectedProject: null },
  reducers: {
    setSelectedProject: (state, action) => { state.selectedProject = action.payload; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createProject.pending, (s) => { s.loading = true; })
      .addCase(createProject.fulfilled, (s, a) => { s.loading = false; s.items.unshift(a.payload); })
      .addCase(createProject.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(updateProject.pending, (s) => { s.loading = true; })
      .addCase(updateProject.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.items.findIndex(p => p._id === a.payload._id);
        if (idx !== -1) s.items[idx] = a.payload;
        s.selectedProject = null;
      })
      .addCase(updateProject.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(deleteProject.fulfilled, (s, a) => { s.items = s.items.filter(p => p._id !== a.payload); });
  },
});

export const { setSelectedProject, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;