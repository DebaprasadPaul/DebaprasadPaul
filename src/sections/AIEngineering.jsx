import { motion } from 'framer-motion';


export default function AIEngineering() {
  return (
    <section id="ai-engineering" className="flex items-center justify-center px-6 py-24">
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

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-text-secondary leading-relaxed text-lg">
              AI is not a replacement for thinking—it's a force multiplier for structured execution.
            </p>

            <div className="space-y-4">
              {[
                "Structured prompting for architecture planning",
                "Iterative refinement through feedback loops",
                "Performance optimization at scale",
                "Rapid prototyping with controlled constraints"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="text-accent-cyan font-bold mt-1">→</div>
                  <div className="text-text-secondary">{item}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Code Block / Card */}
          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)] group"
            style={{
              background: 'rgba(15, 15, 20, 0.6)',
              border: '1px solid rgba(34, 211, 238, 0.1)'
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 backdrop-blur-[24px] backdrop-saturate-[1.8] z-0" />

            {/* Fake Blurred Code Background - refined for subtlety */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none p-4 select-none overflow-hidden mix-blend-overlay">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="text-[10px] text-accent-cyan/30 font-mono whitespace-nowrap blur-[1.5px] mb-1.5">
                  {`const var${i} = "hidden_data_${Math.random().toString(36).substring(7)}"; // optimized`}
                </div>
              ))}
            </div>

            {/* Actual Code Content */}
            <div className="relative z-20 p-6 md:p-8 font-mono text-sm text-text-secondary w-full">
              <div className="mb-3"><span className="text-accent-cyan">const</span> approach = {'{'}</div>

              <div className="space-y-2">
                {[
                  { key: "strategy", val: "systematic" },
                  { key: "execution", val: "precise" },
                  { key: "validation", val: "continuous" },
                  { key: "optimization", val: "iterative" }
                ].map((line, i) => (
                  <motion.div
                    key={line.key}
                    className="pl-4 flex items-center"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (i * 0.1), duration: 0.4 }}
                  >
                    <span className="mr-3 text-text-muted">{line.key}:</span>
                    <motion.span
                      className="text-accent-cyan font-bold bg-accent-cyan/5 px-1.5 py-0.5 rounded border border-accent-cyan/10"
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 211, 238, 0.15)' }}
                      animate={{
                        boxShadow: ["0 0 0px rgba(34,211,238,0)", "0 0 10px rgba(34,211,238,0.2)", "0 0 0px rgba(34,211,238,0)"]
                      }}
                      transition={{
                        boxShadow: { duration: 3, repeat: Infinity, delay: i * 0.5 }
                      }}
                    >
                      "{line.val}"
                    </motion.span>,
                  </motion.div>
                ))}
              </div>

              <div className="mt-3">{'}'}</div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}