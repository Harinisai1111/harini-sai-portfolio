import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { marked } from 'marked';
import { Badge } from './Badge';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: string; // Raw Markdown
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, content }) => {
    const tokens = useMemo(() => {
        if (!content) return [];
        return marked.lexer(content);
    }, [content]);

    const renderTokens = (tokens: any[]) => {
        let isSocials = false;
        let isTech = false;

        return tokens.map((token, idx) => {
            if (token.type === 'heading') {
                const text = token.text.toLowerCase();
                isSocials = text.includes('socials');
                isTech = text.includes('stack');

                return (
                    <h2 key={idx} className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter text-white mt-12 mb-6 first:mt-0">
                        {token.text}
                    </h2>
                );
            }

            if (token.type === 'list' && (isSocials || isTech)) {
                return (
                    <div key={idx} className="flex flex-wrap gap-3 mb-12 w-full">
                        {token.items.map((item: any, iidx: number) => {
                            // Extract text from list item (might contain links)
                            // Improved regex to handle nested brackets/parens often found in badges
                            const label = item.text.replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[\[\]]/g, '').trim();
                            if (!label) return null;
                            return <Badge key={iidx} label={label} />;
                        })}
                    </div>
                );
            }

            // Fallback for other content
            if (token.type === 'paragraph') {
                return <p key={idx} className="text-neutral-400 text-lg leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: marked.parseInline(token.text) }} />;
            }

            if (token.type === 'space') return <div key={idx} className="h-4" />;

            // If we didn't handle it specially, render as HTML for now
            return <div key={idx} dangerouslySetInnerHTML={{ __html: marked.parse(token.raw) }} className="prose prose-invert max-w-none mb-6" />;
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop - Faded instead of black */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm"
                    />

                    {/* Modal Container - "Bubbled" Box Aesthetic */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto bg-neutral-900/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 z-[160] no-scrollbar"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-transparent p-8 flex justify-between items-center z-[130]">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Project Specs</h2>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all text-white border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-8 pb-12 md:px-12 md:pb-16">
                            {renderTokens(tokens)}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AboutModal;
