import React from "react";
import { motion } from "framer-motion";

const PremiumCard = ({
  children,
  className = "",
  hover = true,
  as = "div",
  onClick,
  padding = true,
}) => {
  const Wrapper = motion[as];

  return (
    <Wrapper
      className={`bg-white rounded-xl ${
        padding ? "p-6" : ""
      } shadow-card border border-brand-100 ${
        hover
          ? "hover:shadow-card-hover hover:border-brand-200 cursor-pointer"
          : ""
      } transition-all duration-500 ${className}`}
      whileHover={
        hover
          ? {
              y: -4,
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
      onClick={onClick}
    >
      {children}
    </Wrapper>
  );
};

export const PremiumImageCard = ({
  image,
  alt,
  overlay,
  children,
  className = "",
  aspectRatio = "aspect-[4/3]",
  as = "div",
  onClick,
}) => {
  const Wrapper = motion[as];

  return (
    <Wrapper
      className={`relative overflow-hidden rounded-xl bg-brand-100 ${aspectRatio} group cursor-pointer ${className}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
    >
      <motion.img
        src={image}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/20 to-transparent" />
      )}
      {children && (
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          {children}
        </div>
      )}
    </Wrapper>
  );
};

export default PremiumCard;
