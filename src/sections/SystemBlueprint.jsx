import { motion } from 'framer-motion';
import { useState } from 'react';

export default function SystemBlueprint() {
  const [activeNode, setActiveNode] = useState(null);

  const topRow = [
    { id: 1, title: 'Data Gathering', description: 'Comprehensive data collection across all operational touchpoints.' },
    { id: 2, title: 'Micro Segmentation', description: 'Granular classification based on behavioral and risk patterns.' },
    { id: 3, title: 'Scenario Simulation', description: 'Model multiple intervention pathways and predict outcomes.' },
    { id: 4, title: 'Root Cause Isolation', description: 'Identify core drivers of variance and inefficiency.' },
  ];

  const bottomRow = [
    { id: 5, title: 'Process Redesign', description: 'Engineer new workflows based on analytical insights.' },
    { id: 6, title: 'Monitoring Architecture', description: 'Real-time tracking systems for performance metrics.' },
    { id: 7, title: 'Controlled Iteration', description: 'Continuous refinement through feedback loops.' },
  ];

  const renderNode = (node, index, delay, extraClassName = '') => (
    <motion.div
      key={node.id}
      className={`bg-dark-card border rounded-lg p-6 cursor-pointer transition-all ${extraClassName} ${activeNode === node.id
        ? 'border-accent-cyan bg-dark-border shadow-[0_0_20px_rgba(34,211,238,0.1)]'
        : 'border-dark-border hover:border-accent-cyan'
        }`}
      onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-center">
        <div className="text-2xl font-bold text-accent-cyan mb-2">{node.id}</div>
        <div className="text-sm font-semibold text-text-primary">{node.title}</div>
      </div>
    </motion.div>
  );

  const activeNodeData = [...topRow, ...bottomRow].find(n => n.id === activeNode);

  return (
    <section id="blueprint" className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-text-primary mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Structured Optimization Framework
        </motion.h2>

        {/* Top row: 4 items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          {topRow.map((node, i) => renderNode(node, i, i * 0.1))}
        </div>

        {/* Connecting arrow */}
        <div className="flex justify-center my-2">
          <motion.div
            className="text-accent-cyan/40 text-2xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            ↓
          </motion.div>
        </div>

        {/* Bottom row: 3 items centered */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-2">
          {bottomRow.map((node, i) => renderNode(node, i, 0.5 + i * 0.1, i === 2 ? 'col-span-2 md:col-span-1' : ''))}
        </div>

        {/* Active node detail */}
        {activeNodeData && (
          <motion.div
            className="mt-8 bg-dark-card border border-accent-cyan rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-accent-cyan mb-4">
              {activeNodeData.title}
            </h3>
            <p className="text-text-secondary">
              {activeNodeData.description}
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}