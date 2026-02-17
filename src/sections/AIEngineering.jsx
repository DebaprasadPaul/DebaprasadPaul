import { motion } from 'framer-motion';

export default function AIEngineering() {
  return (
    <section id="ai-engineering" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-text-primary mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          AI-Assisted System Engineering
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">

          {/* Left: Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-text-secondary leading-relaxed">
              AI is not a replacement for thinking—it's a force multiplier for structured execution.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="text-accent-cyan font-bold">→</div>
                <div className="text-text-secondary">Structured prompting for architecture planning</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-accent-cyan font-bold">→</div>
                <div className="text-text-secondary">Iterative refinement through feedback loops</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-accent-cyan font-bold">→</div>
                <div className="text-text-secondary">Performance optimization at scale</div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-accent-cyan font-bold">→</div>
                <div className="text-text-secondary">Rapid prototyping with controlled constraints</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Code Block */}
          <motion.div
            className="bg-dark-card border border-dark-border rounded-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="font-mono text-sm text-text-secondary space-y-2">
              <div><span className="text-accent-cyan">const</span> approach = {'{'}</div>
              <div className="pl-4">strategy: <span className="text-green-400">"systematic"</span>,</div>
              <div className="pl-4">execution: <span className="text-green-400">"precise"</span>,</div>
              <div className="pl-4">validation: <span className="text-green-400">"continuous"</span>,</div>
              <div className="pl-4">optimization: <span className="text-green-400">"iterative"</span></div>
              <div>{'}'}</div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}