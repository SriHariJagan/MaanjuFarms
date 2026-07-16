import React from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const SectionTitle = ({
  title,
  subtitle,
  light = false,
  align = "center",
  decorative = true,
  className = "",
}) => {
  const alignClasses = {
    center: "text-center",
    left: "text-left",
  };

  return (
    <motion.div
      className={`mb-10 md:mb-14 ${alignClasses[align]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {decorative && (
        <motion.div
          className={`inline-flex items-center gap-2 mb-4 ${align === "center" ? "mx-auto" : ""}`}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <span className={`h-px w-6 ${light ? "bg-cream-300/50" : "bg-brand-200"}`} />
          <Leaf
            size={16}
            className={light ? "text-cream-300" : "text-brand-400"}
          />
          <span className={`h-px w-6 ${light ? "bg-cream-300/50" : "bg-brand-200"}`} />
        </motion.div>
      )}

      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
          light ? "text-white" : "text-forest-800"
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <motion.p
          className={`mt-4 text-base md:text-lg max-w-2xl ${
            align === "center" ? "mx-auto" : ""
          } ${light ? "text-cream-200" : "text-brand-600/70"}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
