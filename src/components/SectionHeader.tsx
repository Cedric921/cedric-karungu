import React from "react";
import { motion } from "framer-motion";

type SectionHeaderProps = {
  index: number;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  visible?: boolean;
  trailing?: React.ReactNode;
};

const formatIndex = (n: number) => n.toString().padStart(2, "0");

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  eyebrow,
  title,
  description,
  align = "center",
  visible = true,
  trailing,
}) => {
  const isCenter = align === "center";

  return (
    <motion.div
      className={
        trailing
          ? "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
          : `mb-16 ${isCenter ? "text-center" : "text-left"}`
      }
      variants={containerVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <div className={isCenter && !trailing ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        <motion.div
          variants={itemVariants}
          className={`eyebrow mb-4 ${isCenter && !trailing ? "justify-center" : ""}`}
        >
          <span className="eyebrow-index">{formatIndex(index)}</span>
          <span aria-hidden="true" className="eyebrow-rule" />
          <span>{eyebrow}</span>
        </motion.div>

        <motion.h2 className="section-title" variants={itemVariants}>
          {title}
        </motion.h2>

        {description && (
          <motion.p
            className="mt-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}
      </div>

      {trailing && (
        <motion.div variants={itemVariants} className="shrink-0">
          {trailing}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SectionHeader;
