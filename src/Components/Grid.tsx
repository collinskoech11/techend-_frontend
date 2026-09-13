import React from "react";
import { Grid as MuiGrid, GridProps as MuiGridProps } from "@mui/material";

export interface GridSizeBreakpoints {
  xs?: number | boolean | "auto";
  sm?: number | boolean | "auto";
  md?: number | boolean | "auto";
  lg?: number | boolean | "auto";
  xl?: number | boolean | "auto";
}

export interface GridProps extends Omit<MuiGridProps, "xs" | "sm" | "md" | "lg" | "xl"> {
  size?: GridSizeBreakpoints | number | boolean | "auto";
  component?: React.ElementType;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({ size, item, ...props }, ref) => {
  const breakpoints: any = {};

  if (size && typeof size === "object") {
    if (size.xs !== undefined) breakpoints.xs = size.xs;
    if (size.sm !== undefined) breakpoints.sm = size.sm;
    if (size.md !== undefined) breakpoints.md = size.md;
    if (size.lg !== undefined) breakpoints.lg = size.lg;
    if (size.xl !== undefined) breakpoints.xl = size.xl;
  } else if (size !== undefined) {
    breakpoints.xs = size;
  }

  const isItem = item ?? (size !== undefined);

  return <MuiGrid ref={ref} item={isItem} {...breakpoints} {...props} />;
});

Grid.displayName = "Grid";

export default Grid;
