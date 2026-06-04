import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title, subtitle, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-center mb-12 ${className}`}
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4" style={{ letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
      {subtitle && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;