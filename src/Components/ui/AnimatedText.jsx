import React from "react";
import { motion } from "framer-motion";

const AnimatedText = ({
  text,
  type = "word",
  el: Wrapper = "p",
  className = "",
  once = true,
  threshold = 0.2,
  staggerDelay = 0.04,
  ...props
}) => {
  if (type === "char") {
    const chars = text.split("");
    return (
      <Wrapper className={className} {...props}>
        <motion.span
          initial="hidden"
          whileInView="visible"
          viewport={{ once, margin: "-50px" }}
          className="inline-flex flex-wrap"
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20, rotateX: -90 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  transition: {
                    delay: i * 0.03,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }),
              }}
              custom={i}
              className="inline-block"
              aria-hidden="true"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </Wrapper>
    );
  }

  const words = text.split(" ");
  return (
    <Wrapper className={className} {...props}>
      <motion.span
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        className="inline-flex flex-wrap"
      >
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <motion.span
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: (i) => ({
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: i * staggerDelay,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }),
              }}
              custom={i}
              className="inline-block"
              aria-hidden="true"
            >
              {word}
            </motion.span>
            {i < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </React.Fragment>
        ))}
      </motion.span>
    </Wrapper>
  );
};

export default AnimatedText;
