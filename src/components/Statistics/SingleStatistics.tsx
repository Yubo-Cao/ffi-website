"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface SingleStatisticsProps {
  value: number;
  label: string;
  suffix?: string;
}

const SingleStatistics: React.FC<SingleStatisticsProps> = ({
  value,
  label,
  suffix = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const duration = 2000; // Duration in milliseconds
      const startTime = performance.now();

      const animateCount = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentCount = Math.floor(
          startValue + progress * (value - startValue),
        );

        setDisplayValue(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      };

      requestAnimationFrame(animateCount);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <motion.span
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        className="text-4xl md:text-5xl xl:text-7xl font-bold text-primary"
      >
        {displayValue}
        {suffix}
      </motion.span>
      <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-300">
        {label}
      </p>
    </div>
  );
};

export default SingleStatistics;
