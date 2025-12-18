// Example: How to display GitHub README on Home page
import { useEffect, useState } from 'react';
import { fetchProfileReadme, fetchUserProfile } from '../services/profileService';

export function GitHubProfileSection() {
    const [readme, setReadme] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchProfileReadme(),
            fetchUserProfile()
        ]).then(([readmeData, profileData]) => {
            setReadme(readmeData);
            setProfile(profileData);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="animate-pulse">Loading profile...</div>;
    }

    return (
        <div className="github-profile-section">
            {/* Profile Header */}
            {profile && (
                <div className="profile-header flex items-center gap-6 mb-8">
                    <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-24 h-24 rounded-full border-4 border-purple-500"
                    />
                    <div>
                        <h2 className="text-3xl font-bold">{profile.name}</h2>
                        {profile.bio && <p className="text-gray-400 mt-2">{profile.bio}</p>}
                        <div className="flex gap-6 mt-4 text-sm text-gray-500">
                            <span>📦 {profile.repositories} repositories</span>
                            <span>👥 {profile.followers} followers</span>
                            <span>🔗 {profile.following} following</span>
                        </div>
                    </div>
                </div>
            )}

            {/* README Content */}
            {readme && (
                <div className="readme-content prose prose-invert max-w-none">
                    <div
                        className="markdown-body"
                        dangerouslySetInnerHTML={{ __html: readme }}
                    />
                </div>
            )}
        </div>
    );
}

// Usage in Home.tsx:
// import { GitHubProfileSection } from '../components/GitHubProfileSection';
//
// Then add in your JSX:
// <GitHubProfileSection />
