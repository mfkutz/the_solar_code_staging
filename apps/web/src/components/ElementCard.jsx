import React from 'react';
import { motion } from 'framer-motion';

const ElementCard = ({ element, index }) => {
  const { name, meaning, color, icon: Icon } = element;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2"
      style={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}40`
      }}
    >
      <div className="relative z-10">
        <div 
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color }}>
          {name}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {meaning}
        </p>
      </div>
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${color}10, transparent 70%)`
        }}
      ></div>
    </motion.div>
  );
};

export default ElementCard;