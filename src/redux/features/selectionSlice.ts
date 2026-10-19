import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Selection } from "../../types";
const initial: Selection = {
  source: "",
  category: "",
  company: "",
  segment: "Residential",
};
const slice = createSlice({
  name: "selection",
  initialState: initial,
  reducers: {
    setSource: (s, a: PayloadAction<string>) => {
      s.source = a.payload;
      s.category = "";
      s.company = "";
    },
    setCategory: (s, a: PayloadAction<string>) => {
      s.category = a.payload;
      s.company = "";
    },
    setCompany: (s, a: PayloadAction<string>) => {
      s.company = a.payload;
    },
    setSegment: (s, a: PayloadAction<Selection["segment"]>) => {
      s.segment = a.payload;
    },
    resetSelection: () => initial,
  },
});
export const { setSource, setCategory, setCompany, setSegment, resetSelection } =
  slice.actions;
export default slice.reducer;
