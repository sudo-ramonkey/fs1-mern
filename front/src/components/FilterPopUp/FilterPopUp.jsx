import React from "react";
import {
  Popover,
  PopoverContent,
  Button,
  Accordion,
  AccordionItem,
} from "@carbon/react";
import { Filter } from "@carbon/react/icons";
import "./styles.css";

function FilterPopUp() {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover
      align="bottom-left"
      isTabTip
      open={open}
      onRequestClose={() => setOpen(false)}
    >
      <Button
        size="sm"
        onClick={() => setOpen(!open)}
        renderIcon={Filter}
        className="pop-up-filter-btn"
      >
        Filters
      </Button>
      <PopoverContent>
        <Accordion align="start" style={{ width: "300px" }}>
          <AccordionItem title="Panel A">Panel A</AccordionItem>
          <AccordionItem title="Panel B">Panel B</AccordionItem>
          <AccordionItem title="Panel C">Panel C</AccordionItem>
        </Accordion>
      </PopoverContent>
    </Popover>
  );
}

export default FilterPopUp;
