/**
 * Extract metadata from a URL
 * Since CORS proxies are unreliable, we use a smart fallback approach
 */

interface UrlMetadata {
    title: string
    description: string
    image: string
    favicon: string
    domain: string
    dominantColor: string
}

/**
 * Extract basic metadata from URL (always works, no proxy needed)
 */
export async function extractUrlMetadata(url: string): Promise<Partial<UrlMetadata>> {
    console.log('🔧 [Metadata] Smart extraction for:', url)
    try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname.replace('www.', '')

        // Smart title extraction from domain and path
        const title = extractSmartTitle(urlObj, domain)

        // Generate description based on URL structure
        const description = generateSmartDescription(urlObj, domain)

        const metadata: Partial<UrlMetadata> = {
            domain,
            title,
            description,
            // Use Google's favicon service - very reliable
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
            // No external image service (all are blocked by CORS)
            // UI will show a nice fallback with the first letter of the title
            image: '',
            dominantColor: generateColorFromDomain(domain),
        }

        console.log('✅ [Metadata] Smart extraction result:', metadata)
        return metadata
    } catch (error) {
        console.error('❌ [Metadata] Error in extraction:', error)
        return {
            domain: 'unknown',
            title: url,
            description: '',
            favicon: '',
            image: '',
            dominantColor: 'hsl(0, 0%, 50%)',
        }
    }
}

/**
 * Extract smart title from URL
 */
function extractSmartTitle(urlObj: URL, domain: string): string {
    // Known domains with better titles
    const domainTitles: Record<string, string> = {
        'github.com': 'GitHub',
        'react.dev': 'React',
        'nextjs.org': 'Next.js',
        'vercel.com': 'Vercel',
        'google.com': 'Google',
        'youtube.com': 'YouTube',
        'twitter.com': 'Twitter',
        'facebook.com': 'Facebook',
        'linkedin.com': 'LinkedIn',
        'stackoverflow.com': 'Stack Overflow',
        'medium.com': 'Medium',
        'dev.to': 'DEV Community',
        'reddit.com': 'Reddit',
        'npmjs.com': 'npm',
    }

    // Check if it's a known domain
    if (domainTitles[domain]) {
        // If there's a path, append it
        const pathParts = urlObj.pathname.split('/').filter(Boolean)
        if (pathParts.length > 0) {
            const lastPart = pathParts[pathParts.length - 1]
            const cleaned = lastPart.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
            if (cleaned.length > 2) {
                return `${domainTitles[domain]} - ${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}`
            }
        }
        return domainTitles[domain]
    }

    // Extract from pathname
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    if (pathParts.length > 0) {
        const lastPart = pathParts[pathParts.length - 1]
        const cleaned = lastPart.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
        if (cleaned.length > 3) {
            return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
        }
    }

    // Fallback to domain name with proper capitalization
    const domainName = domain.split('.')[0]
    return domainName.charAt(0).toUpperCase() + domainName.slice(1)
}

/**
 * Generate smart description
 */
function generateSmartDescription(urlObj: URL, domain: string): string {
    const domainDescriptions: Record<string, string> = {
        'github.com': 'Code repository and development platform',
        'react.dev': 'JavaScript library for building user interfaces',
        'nextjs.org': 'The React Framework for Production',
        'vercel.com': 'Platform for frontend developers',
        'google.com': 'Search engine and online services',
        'youtube.com': 'Video sharing platform',
        'twitter.com': 'Social networking service',
        'linkedin.com': 'Professional networking platform',
        'stackoverflow.com': 'Q&A platform for developers',
        'medium.com': 'Publishing platform for writers',
        'dev.to': 'Community for developers',
        'reddit.com': 'Social news and discussion website',
        'npmjs.com': 'Package registry for JavaScript',
    }

    if (domainDescriptions[domain]) {
        return domainDescriptions[domain]
    }

    // Generic description
    return `Visit ${domain} to learn more`
}

/**
 * Generate a consistent color based on domain name
 */
function generateColorFromDomain(domain: string): string {
    // Simple hash function
    let hash = 0
    for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash % 360)
    const saturation = 65 + (Math.abs(hash % 15))
    const lightness = 55 + (Math.abs(hash % 10))

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

/**
 * Enhanced metadata extraction - attempts proxy first, falls back to smart extraction
 */
export async function fetchUrlMetadataViaProxy(url: string): Promise<Partial<UrlMetadata>> {
    console.log('🔍 [Metadata] Enhanced fetch for URL:', url)

    // CORS proxies are unreliable, so we'll use smart extraction directly
    // This provides consistent, fast results without network dependency
    console.log('🎯 [Metadata] Using smart extraction (proxy-free)')
    return extractUrlMetadata(url)
}
