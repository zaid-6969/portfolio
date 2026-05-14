import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/projects");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/projects", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create project");
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/projects/${id}`, formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update project");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete project");
    }
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedProject: null,
  },
  reducers: {
    setSelectedProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createProject.pending, (state) => { state.loading = true; })
      .addCase(createProject.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(createProject.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(updateProject.pending, (state) => { state.loading = true; })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.selectedProject = null;
      })
      .addCase(updateProject.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
      });
  },
});

export const { setSelectedProject, clearError } = projectsSlice.actions;
export default projectsSlice.reducer;