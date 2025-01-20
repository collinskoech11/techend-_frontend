import { CategoryContainer, MinMaxCntainer, PriceFilter, PriceInput } from '@/StyledComponents/FiltersComponents';
import { ExtendedFilters } from '@/StyledComponents/Products';
import { FilterCategory, PriceMinTypo, PriceTitle } from '@/StyledComponents/Typos';
import React from 'react';
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

function valuetext(value: number) {
  return `${value}°C`;
}
function Filters() {
      const [value, setValue] = React.useState<number[]>([20, 37]);

      const handleChange = (event: Event, newValue: number | number[]) => {
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
      {/* <PriceFilter>
        <PriceTitle>Essential Kinds</PriceTitle>
        <br />
        <hr />
        <CategoryContainer>
          <FilterCategory>All Essentials</FilterCategory>
          <FilterCategory>UNDERSHIRTS</FilterCategory>
          <FilterCategory>SOCKS</FilterCategory>
          <FilterCategory>WATCHES</FilterCategory>
          <FilterCategory>HATS</FilterCategory>
          <FilterCategory>JEWELRY</FilterCategory>
          <FilterCategory>EYEWEAR</FilterCategory>
          <FilterCategory>BELTS</FilterCategory>
        </CategoryContainer>
      </PriceFilter>
      <PriceFilter>
        <PriceTitle>Essential Kinds</PriceTitle>
        <br />
        <hr />
        <CategoryContainer>
          <FilterCategory>All Colours</FilterCategory>
          <FilterCategory>Blue</FilterCategory>
          <FilterCategory>Black</FilterCategory>
          <FilterCategory>Gray</FilterCategory>
          <FilterCategory>Maroon</FilterCategory>
          <FilterCategory>Red</FilterCategory>
          <FilterCategory>White</FilterCategory>
          <FilterCategory>Green</FilterCategory>
          <FilterCategory>Brown</FilterCategory>
        </CategoryContainer>
      </PriceFilter>
      <PriceFilter>
        <PriceTitle>Essential Kinds</PriceTitle>
        <br />
        <hr />
        <CategoryContainer>
          <FilterCategory>All Sizes</FilterCategory>
          <FilterCategory>SMALL</FilterCategory>
          <FilterCategory>MEDIUM</FilterCategory>
          <FilterCategory>LARGE</FilterCategory>
          <FilterCategory>X LARGE</FilterCategory>
          <FilterCategory>2X LARGE</FilterCategory>
          <FilterCategory>3X LARGE</FilterCategory>
        </CategoryContainer>
      </PriceFilter> */}
    </ExtendedFilters>
  );
}

export default Filters