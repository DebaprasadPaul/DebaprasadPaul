import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ResumeModal({ isOpen, onClose, resumes }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to close on outside click */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom-right chatbot-style panel (Mobile: Bottom Sheet) */}
          <motion.div
            className="fixed bottom-0 md:bottom-6 left-0 md:left-auto md:right-6 z-50 w-full md:w-80 bg-dark-card border-t md:border border-dark-border rounded-t-2xl md:rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{
              type: 'spring',
              damping: 22,
              stiffness: 300,
              mass: 0.8
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
              <h3 className="text-base font-semibold text-text-primary">
                Documents
              </h3>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-accent-cyan transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Resume list */}
            <div className="p-3 space-y-1 max-h-72 overflow-y-auto">
              {resumes.filter(r => r.is_selected).map((resume, index) => (
                <a
                  key={index}
                  href={resume.file_url || resume.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-lg px-4 py-3 hover:bg-dark-border/50 transition-all duration-200 group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="mt-1 text-sm font-bold text-accent-cyan/50 font-mono">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                      {resume.title}
                    </div>

                    {/* Description — only visible on hover */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: hoveredIndex === index ? 'auto' : 0,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        {resume.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Action Icon (Right side, visible only on hover) */}
                  <div className="mt-0.5 text-accent-cyan opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-10px] group-hover:translate-x-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
              ))}
              {resumes.filter(r => r.is_selected).length === 0 && (
                <div className="text-center text-text-secondary py-4 text-sm">
                  No documents available.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}