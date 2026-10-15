import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Selection } from "../types";
const initial: Selection = {
  source: "",
  point: "",
  company: "",
  segment: "Residential",
};
const slice = createSlice({
  name: "selection",
  initialState: initial,
  reducers: {
    setSource: (s, a: PayloadAction<string>) => {
      s.source = a.payload;
      s.point = "";
      s.company = "";
    },
    setPoint: (s, a: PayloadAction<string>) => {
      s.point = a.payload;
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
export const { setSource, setPoint, setCompany, setSegment, resetSelection } =
  slice.actions;
export default slice.reducer;
