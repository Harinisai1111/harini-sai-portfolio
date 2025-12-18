import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserProfile } from '../services/profileService';
import { User, GraduationCap, School, Phone, Calendar } from 'lucide-react';

const ProfileDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        fetchUserProfile().then(setProfile);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    // Styling mimics typical streaming service profile menus
    return (
        <div className="relative z-50">
            {/* Trigger: Profile Avatar */}
            <div
                onClick={toggleOpen}
                className="flex items-center gap-3 cursor-pointer group"
            >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded bg-red-600 flex items-center justify-center overflow-hidden border border-transparent group-hover:border-white transition-all">
                    <img
                        src={profile?.avatarUrl || "https://github.com/github.png"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="hidden md:block transition-transform group-hover:rotate-180">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M7 10l5 5 5-5z" /></svg>
                </div>
            </div>

            {/* Dropdown Content */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Invisible backdrop to close on click outside */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-4 w-72 md:w-80 bg-black/95 border border-white/10 shadow-2xl rounded-sm p-0 overflow-hidden z-50 backdrop-blur-3xl"
                        >
                            <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-neutral-900/50">
                                <img
                                    src={profile?.avatarUrl || "https://github.com/github.png"}
                                    className="w-12 h-12 rounded bg-neutral-800"
                                />
                                <div>
                                    <p className="text-white font-bold text-sm leading-tight">{profile?.name || "Harini Sai"}</p>
                                    <p className="text-neutral-500 text-xs">Manage Profiles</p>
                                </div>
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 text-neutral-300 group hover:text-white transition-colors cursor-default">
                                        <School size={16} className="mt-0.5 text-red-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Institution</p>
                                            <p className="text-sm font-medium">SRM Institute of Science and Technology</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-neutral-300 group hover:text-white transition-colors cursor-default">
                                        <GraduationCap size={16} className="mt-0.5 text-red-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Qualificiation</p>
                                            <p className="text-sm font-medium">B.Tech CSE w/s Software Engineering</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-neutral-300 group hover:text-white transition-colors cursor-default">
                                        <Calendar size={16} className="mt-0.5 text-red-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Age</p>
                                            <p className="text-sm font-medium">19</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 text-neutral-300 group hover:text-white transition-colors cursor-default">
                                        <Phone size={16} className="mt-0.5 text-red-600" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">Contact</p>
                                            <p className="text-sm font-medium">+91 93445 28792</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 border-t border-white/10 bg-neutral-900/30 text-center">
                                <a href="mailto:harinisai@example.com" className="text-[10px] text-white/50 hover:text-white uppercase tracking-widest hover:underline cursor-pointer">
                                    Sign out of Portfolio
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;
