import React from "react";

const shimmerBase = "bg-gradient-to-r from-brand-100 via-brand-200/50 to-brand-100 bg-[length:200%_100%] animate-shimmer";

const Skeleton = ({ className = "", variant = "text" }) => {
  const variants = {
    text: "h-4 w-full rounded",
    title: "h-6 w-3/4 rounded",
    avatar: "h-12 w-12 rounded-full",
    thumbnail: "h-20 w-20 rounded-lg",
    card: "h-64 w-full rounded-xl",
    image: "h-48 w-full rounded-lg",
    badge: "h-6 w-20 rounded-full",
    button: "h-10 w-32 rounded-md",
  };

  return (
    <div
      className={`${shimmerBase} ${variants[variant] || variant} ${className}`}
      aria-hidden="true"
    />
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-card border border-brand-100">
    <div className={`${shimmerBase} aspect-[4/3] w-full`} />
    <div className="p-4 space-y-3">
      <div className={`${shimmerBase} h-5 w-3/4 rounded`} />
      <div className={`${shimmerBase} h-4 w-1/3 rounded`} />
      <div className={`${shimmerBase} h-10 w-full rounded-md`} />
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-card border border-brand-100">
    <div className={`${shimmerBase} aspect-[4/3] w-full`} />
    <div className="p-5 space-y-2">
      <div className={`${shimmerBase} h-5 w-2/3 rounded`} />
      <div className={`${shimmerBase} h-4 w-full rounded`} />
      <div className={`${shimmerBase} h-4 w-5/6 rounded`} />
    </div>
  </div>
);

export default Skeleton;
