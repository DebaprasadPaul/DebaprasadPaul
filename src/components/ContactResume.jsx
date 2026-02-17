import { motion } from 'framer-motion';
import { useState } from 'react';
import ResumeModal from './ResumeModal';

export default function ContactResume({ resumes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Let's Build Something That Works.
          </h2>

          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
            If you need financial systems that scale, risk frameworks that hold, or processes that actually work—let's talk.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="border border-accent-cyan text-accent-cyan px-8 py-4 rounded-lg font-semibold hover:bg-accent-cyan hover:text-dark-bg transition-colors text-lg"
          >
            View Resume
          </button>
        </motion.div>

      </div>

      <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} resumes={resumes} />
    </section>
  );
}