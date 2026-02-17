import { motion } from 'framer-motion';

export default function CaseStudy() {
  return (
    <section id="casestudy" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto">

        <motion.h2
          className="text-4xl md:text-5xl font-bold text-text-primary mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          High-Variance Portfolio Stabilization — Northeast Region
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-2 gap-12 bg-dark-card border border-dark-border rounded-2xl p-10 hover:border-accent-cyan transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Left: Metrics */}
          <div className="space-y-8">
            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2">₹2 Cr → ₹15 Cr</div>
              <div className="text-text-secondary">Scale Expansion</div>
            </div>

            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2">93–95%</div>
              <div className="text-text-secondary">Stabilized Performance</div>
            </div>

            <div>
              <div className="text-5xl font-bold text-accent-cyan mb-2">Multi-District</div>
              <div className="text-text-secondary">Operational Governance</div>
            </div>
          </div>

          {/* Right: Description */}
          <div className="flex flex-col justify-center space-y-6">
            <p className="text-text-secondary leading-relaxed">
              Designed and implemented a structured intervention framework for high-variance financial operations across the Northeast region.
            </p>

            <p className="text-text-secondary leading-relaxed">
              Through systematic segmentation, simulation modeling, and process redesign, achieved portfolio expansion from ₹2 Cr to ₹15 Cr while maintaining performance stability between 93–95%.
            </p>

            <p className="text-text-secondary leading-relaxed">
              Established multi-district governance protocols and monitoring architecture to ensure operational consistency at scale.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}