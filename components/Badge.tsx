import React from 'react';
import {
    Github, Instagram, Linkedin, Mail, Twitter, Disc as Discord,
    Facebook, Pin as Pinterest, Globe, Code2, Database, Layers,
    Cpu, Terminal, Binary, Palette, Zap, Box,
    Layout, Chrome, Share2, Wind, Server,
    Cloud, Flame, Coffee, Activity, TrendingUp,
    LineChart, Brain, Scissors, Camera
} from 'lucide-react';

interface BadgeProps {
    label: string;
    icon?: React.ReactNode;
    color?: string;
    className?: string;
}

const BRAND_COLORS: Record<string, string> = {
    // Socials
    'discord': 'bg-[#5865F2]',
    'facebook': 'bg-[#1877F2]',
    'instagram': 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    'linkedin': 'bg-[#0077B5]',
    'pinterest': 'bg-[#E60023]',
    'reddit': 'bg-[#FF4500]',
    'x': 'bg-black',
    'twitter': 'bg-[#1DA1F2]',
    'codepen': 'bg-black',
    'email': 'bg-[#D44638]',

    // Tech - Languages
    'c': 'bg-[#A8B9CC] text-black',
    'c++': 'bg-[#00599C]',
    'java': 'bg-[#f89820]',
    'javascript': 'bg-[#F7DF1E] text-black',
    'js': 'bg-[#F7DF1E] text-black',
    'html5': 'bg-[#E34F26]',
    'html': 'bg-[#E34F26]',
    'css3': 'bg-[#1572B6]',
    'css': 'bg-[#1572B6]',
    'kotlin': 'bg-[#7F52FF]',
    'python': 'bg-[#3776AB]',
    'typescript': 'bg-[#3178C6]',
    'ts': 'bg-[#3178C6]',

    // Tech - Frameworks/Tools
    'react': 'bg-[#61DAFB] text-black',
    'next.js': 'bg-black',
    'node.js': 'bg-[#339933]',
    'express.js': 'bg-[#000000]',
    'vite': 'bg-gradient-to-br from-[#41D1FF] to-[#BD34FE]',
    'tailwindcss': 'bg-[#06B6D4]',
    'firebase': 'bg-[#FFCA28] text-black',
    'supabase': 'bg-[#3ECF8E]',
    'mongodb': 'bg-[#47A248]',
    'mysql': 'bg-[#4479A1]',
    'postgresql': 'bg-[#4169E1]',
    'vercel': 'bg-black',
    'netlify': 'bg-[#00C8FF] text-black',
    'googlecloud': 'bg-[#4285F4]',
    'aws': 'bg-[#FF9900] text-black',
    'npm': 'bg-[#CB3837]',
    'github': 'bg-[#181717]',
    'github actions': 'bg-[#2088FF]',

    // Tools
    'figma': 'bg-[#F24E1E]',
    'canva': 'bg-[#00C4CC] text-black',
    'adobe lightroom': 'bg-[#31A8FF]',
    'aseprite': 'bg-[#7D929E]',
    'pandas': 'bg-[#150458]',
    'numpy': 'bg-[#013243]',
    'pytorch': 'bg-[#EE4C2C]',
    'matplotlib': 'bg-[#11557c] text-white',
};

export const Badge: React.FC<BadgeProps> = ({ label, className = '' }) => {
    const normalizedLabel = label.toLowerCase();
    const colorClass = BRAND_COLORS[normalizedLabel] || 'bg-neutral-800';

    const getIcon = (tag: string) => {
        switch (tag) {
            case 'discord': return <Discord size={12} />;
            case 'facebook': return <Facebook size={12} />;
            case 'instagram': return <Instagram size={12} />;
            case 'linkedin': return <Linkedin size={12} />;
            case 'pinterest': return <Pinterest size={12} />;
            case 'x':
            case 'twitter': return <Twitter size={12} />;
            case 'github': return <Github size={12} />;
            case 'email': return <Mail size={12} />;
            case 'supabase':
            case 'firebase': return <Flame size={12} />;
            case 'react': return <Layout size={12} />;
            case 'node.js': return <Share2 size={12} />;
            case 'typescript':
            case 'javascript': return <Terminal size={12} />;
            case 'python': return <Binary size={12} />;
            case 'tailwind':
            case 'tailwindcss': return <Wind size={12} />;
            case 'mongodb':
            case 'mysql':
            case 'postgresql': return <Database size={12} />;
            case 'googlecloud':
            case 'aws': return <Cloud size={12} />;
            case 'figma': return <Layers size={12} />;
            case 'canva': return <Palette size={12} />;
            case 'aseprite': return <Scissors size={12} />;
            case 'adobe lightroom': return <Camera size={12} />;
            default: return <Code2 size={12} />;
        }
    };

    return (
        <div className={`${colorClass} ${className} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider text-white shadow-sm transition-all hover:scale-105 hover:shadow-lg cursor-default`}>
            {getIcon(normalizedLabel)}
            {label}
        </div>
    );
};
