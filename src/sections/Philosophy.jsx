import { motion } from 'framer-motion';

export default function Philosophy() {
  const steps = [
    'Input',
    'Structure',
    'Monitor',
    'Optimize',
    'Stability'
  ];

  return (
    <section id="philosophy" className="flex items-center justify-center px-6 py-24">
      <div className="max-w-5xl mx-auto">

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-text-primary mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Process &gt; Outcome
        </motion.h2>

        <motion.p
          className="text-xl text-text-secondary text-center mb-16 max-w-3xl mx-auto italic"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          "I believe outcomes are byproducts of engineered processes."
        </motion.p>

        {/* Desktop: Horizontal Flow */}
        <motion.div
          className="hidden md:grid grid-cols-5 gap-4 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex-1 text-center">
                <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-accent-cyan transition-colors">
                  <div className="text-lg font-semibold text-accent-cyan">
                    {step}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 mx-2 text-accent-cyan text-2xl">
                  →
                </div>
              )}
            </div>
          ))}
        </motion.div>

        {/* Mobile: Vertical Flow */}
        <motion.div
          className="md:hidden space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {steps.map((step, index) => (
            <div key={step}>
              <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-accent-cyan transition-colors text-center">
                <div className="text-lg font-semibold text-accent-cyan">
                  {step}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="text-accent-cyan text-2xl text-center my-2">
                  ↓
                </div>
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}