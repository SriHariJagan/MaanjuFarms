import React from "react";
import { motion } from "framer-motion";

const statusConfig = {
  "in-stock": {
    label: "In Stock",
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  "low-stock": {
    label: "Low Stock",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  out: {
    label: "Out of Stock",
    classes: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  new: {
    label: "New",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  organic: {
    label: "Organic",
    classes: "bg-brand-50 text-brand-700 border-brand-200",
    dot: "bg-brand-500",
  },
  bestseller: {
    label: "Bestseller",
    classes: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
};

const Badge = ({
  status = "in-stock",
  label,
  showDot = true,
  className = "",
  animated = false,
}) => {
  const config = statusConfig[status] || {
    label: label || status,
    classes: "bg-brand-50 text-brand-700 border-brand-200",
    dot: "bg-brand-500",
  };

  const Comp = animated ? motion.span : "span";
  const animProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { type: "spring", stiffness: 500, damping: 25 },
      }
    : {};

  return (
    <Comp
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.classes} ${className}`}
      {...animProps}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {label || config.label}
    </Comp>
  );
};

export default Badge;
