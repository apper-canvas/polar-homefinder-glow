import React from "react";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const FilterBadge = ({ label, onRemove, variant = "primary" }) => {
  return (
    <Badge variant={variant} className="flex items-center gap-1 pr-1">
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
      >
        <ApperIcon name="X" className="w-3 h-3" />
      </button>
    </Badge>
  );
};

export default FilterBadge;