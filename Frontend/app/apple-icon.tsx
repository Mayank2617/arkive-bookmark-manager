import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 180,
    height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 120,
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '40px',
                }}
            >
                📚
            </div>
        ),
        {
            ...size,
        }
    )
}
