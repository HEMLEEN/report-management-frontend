import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PointOfContact, Project, PropertyType, Source } from '../types';

interface WorkflowState {
  source: Source | null;
  pointOfContact: PointOfContact | null;
  project: Project | null;
  propertyType: PropertyType | null;
  completed: boolean;
}

const initialState: WorkflowState = {
  source: null,
  pointOfContact: null,
  project: null,
  propertyType: null,
  completed: false,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setSource: (state, action: PayloadAction<Source>) => {
      state.source = action.payload;
      state.pointOfContact = null;
      state.project = null;
      state.propertyType = null;
      state.completed = false;
    },
    setPointOfContact: (state, action: PayloadAction<PointOfContact>) => {
      state.pointOfContact = action.payload;
      state.project = null;
      state.propertyType = null;
      state.completed = false;
    },
    setProject: (state, action: PayloadAction<Project>) => {
      state.project = action.payload;
      state.propertyType = null;
      state.completed = false;
    },
    setPropertyType: (state, action: PayloadAction<PropertyType>) => {
      state.propertyType = action.payload;
      state.completed = true;
    },
    resetWorkflow: () => initialState,
  },
});

export const { setSource, setPointOfContact, setProject, setPropertyType, resetWorkflow } = workflowSlice.actions;
export default workflowSlice.reducer;