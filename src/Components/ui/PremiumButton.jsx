import React from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-500 shadow-soft hover:shadow-hover",
  secondary:
    "bg-transparent text-brand-700 border-2 border-brand-200 hover:border-brand-400 hover:bg-brand-50",
  outline:
    "bg-transparent text-brand-600 border border-brand-300 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
  dark: "bg-forest-800 text-white hover:bg-forest-700 shadow-soft hover:shadow-hover",
};

const sizes = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-sm gap-2",
  lg: "px-8 py-4 text-base gap-2.5",
  xl: "px-10 py-5 text-lg gap-3",
};

const PremiumButton = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  onClick,
  href,
  className = "",
  disabled = false,
  loading = false,
  type = "button",
  magnetic = false,
  ...props
}) => {
  const baseClasses = `relative inline-flex items-center justify-center font-semibold rounded-md transition-all duration-300 ${sizes[size]} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group ${className}`;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {Icon && iconPosition === "left" && <Icon size={size === "sm" ? 14 : size === "md" ? 16 : size === "lg" ? 18 : 20} className="shrink-0" />}
        {loading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          children
        )}
        {Icon && iconPosition === "right" && <Icon size={size === "sm" ? 14 : size === "md" ? 16 : size === "lg" ? 18 : 20} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />}
      </span>
      {variant === "primary" && (
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
    </>
  );

  const motionProps = {
    whileHover: magnetic ? { scale: 1.03 } : { y: -1 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        disabled={disabled}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disabled || loading}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default PremiumButton;
