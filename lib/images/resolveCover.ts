import type { GitHubRepository } from '../github/client';
import { supabase } from '../supabase/client';

/**
 * Resolve cover image for a project
 * Priority:
 * 1. GitHub social preview (if custom)
 * 2. Supabase Storage custom upload
 * 3. Unsplash with deterministic seed
 * 4. Language-based gradient
 */
export async function resolveCoverImage(project: {
    slug: string;
    name: string;
    social_preview_url?: string | null;
    language?: string | null;
}): Promise<string> {
    // 1. Use GitHub social preview if available
    if (project.social_preview_url) {
        return project.social_preview_url;
    }

    // 2. Check for custom uploaded image in Supabase Storage
    try {
        const { data: files } = await supabase.storage
            .from('covers')
            .list(project.slug);

        if (files && files.length > 0) {
            const { data } = supabase.storage
                .from('covers')
                .getPublicUrl(`${project.slug}/${files[0].name}`);

            return data.publicUrl;
        }
    } catch (error) {
        console.warn(`Could not check Supabase storage for ${project.slug}:`, error);
    }

    // 3. Generate from Unsplash with deterministic seed
    const seed = hashString(project.name);
    const category = getCategoryKeyword(project.language);
    return `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&q=80&w=2070&${category}`;
}

/**
 * Get fallback gradient based on programming language
 */
export function getLanguageGradient(language: string | null): string {
    const gradients: Record<string, string> = {
        TypeScript: 'linear-gradient(135deg, #3178c6 0%, #235a97 100%)',
        JavaScript: 'linear-gradient(135deg, #f7df1e 0%, #f0db4f 100%)',
        Python: 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)',
        Rust: 'linear-gradient(135deg, #ce422b 0%, #000000 100%)',
        Go: 'linear-gradient(135deg, #00add8 0%, #5dc9e2 100%)',
        Java: 'linear-gradient(135deg, #007396 0%, #f89820 100%)',
        'C++': 'linear-gradient(135deg, #00599c 0%, #004482 100%)',
        Ruby: 'linear-gradient(135deg, #cc342d 0%, #a91401 100%)',
        PHP: 'linear-gradient(135deg, #777bb4 0%, #4f5b93 100%)',
        Swift: 'linear-gradient(135deg, #ffac45 0%, #fa7343 100%)',
        Kotlin: 'linear-gradient(135deg, #7f52ff 0%, #0095d5 100%)',
        Dart: 'linear-gradient(135deg, #0175c2 0%, #13b9fd 100%)',
    };

    return gradients[language || ''] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
}

/**
 * Generate a simple hash from string for deterministic Unsplash seeds
 */
function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    // Convert to positive number and pad
    const positiveHash = Math.abs(hash);
    return positiveHash.toString().padStart(10, '0').substring(0, 10);
}

/**
 * Get category keyword for Unsplash search
 */
function getCategoryKeyword(language: string | null): string {
    const keywords: Record<string, string> = {
        TypeScript: 'technology',
        JavaScript: 'code',
        Python: 'data',
        Rust: 'systems',
        Go: 'cloud',
        Java: 'enterprise',
        'C++': 'performance',
        Ruby: 'web',
        PHP: 'server',
        Swift: 'mobile',
        Kotlin: 'android',
        Dart: 'flutter',
    };

    return `category=${keywords[language || ''] || 'technology'}`;
}
