import { MinMaxCntainer, PriceFilter, PriceInput } from '@/StyledComponents/FiltersComponents';
import { ExtendedFilters } from '@/StyledComponents/Products';
import { PriceMinTypo, PriceTitle } from '@/StyledComponents/Typos';
import React from 'react';
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value: number) {
  return `${value}°C`;
}
function Filters() {
      const [value, setValue] = React.useState<number[]>([20, 37]);

      const handleChange = (event: Event, newValue: number | number[]) => {
        console.log("Slider value changed:", event);
        setValue(newValue as number[]);
      };

  return (
    <ExtendedFilters sx={{display:{md:"block", xs:"none"}}}>
      <PriceFilter>
        <PriceTitle>Price</PriceTitle>
        <MinMaxCntainer>
          <PriceMinTypo>Min</PriceMinTypo>
          <PriceInput placeholder="500" type="number"></PriceInput>
          <PriceMinTypo>-</PriceMinTypo>
          <PriceInput placeholder="500" type="number"></PriceInput>
          <PriceMinTypo>Max</PriceMinTypo>
        </MinMaxCntainer>
        <Box sx={{ mt: 3 }}>
          <Slider
            getAriaLabel={() => "Temperature range"}
            value={value}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
          />
        </Box>
      </PriceFilter>
    </ExtendedFilters>
  );
}

export default Filters