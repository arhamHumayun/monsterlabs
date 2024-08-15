"use client"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "./ui/dropdown-menu";
import { Button,  } from "./ui/button";

export default function SortByCreaturesDropdown() {
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="justify-self-center">
        Sort by
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup
      // value={position}
      // onValueChange={setPosition}
      >
        <DropdownMenuRadioItem value="latest">
          Latest
        </DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="alphabetical">
          Alphabetical
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}