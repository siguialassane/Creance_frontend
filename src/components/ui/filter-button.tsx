"use client";

import * as React from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface FilterButtonProps {
  onClick: () => void;
  activeFiltersCount?: number;
  disabled?: boolean;
}

export function FilterButton({
  onClick,
  activeFiltersCount = 0,
  disabled = false,
}: FilterButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            variant="outline"
            className="border-orange-500 hover:bg-orange-50 text-orange-700 h-10 px-4 font-medium relative"
            disabled={disabled}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filtres avancés</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

