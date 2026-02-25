// Simple teal bicycle — minimal, anime-inspired, small
export default function Bicycle({ x, y, facingRight = true }) {
    return (
        <g transform={`translate(${x}, ${y}) scale(${facingRight ? 0.7 : -0.7}, 0.7)`}>
            {/* Shadow */}
            <ellipse cx="18" cy="28" rx="16" ry="3" fill="rgba(0,0,0,0.1)" />

            {/* Back wheel */}
            <circle cx="0" cy="20" r="9" fill="none" stroke="#3B2F20" strokeWidth="2" />
            <circle cx="0" cy="20" r="1.5" fill="#3B2F20" />

            {/* Front wheel */}
            <circle cx="36" cy="20" r="9" fill="none" stroke="#3B2F20" strokeWidth="2" />
            <circle cx="36" cy="20" r="1.5" fill="#3B2F20" />

            {/* Frame — teal, simple */}
            <line x1="0" y1="20" x2="18" y2="6" stroke="#5F9EA0" strokeWidth="2" />
            <line x1="18" y1="6" x2="36" y2="20" stroke="#5F9EA0" strokeWidth="2" />
            <line x1="0" y1="20" x2="18" y2="15" stroke="#5F9EA0" strokeWidth="1.5" />
            <line x1="18" y1="15" x2="36" y2="20" stroke="#5F9EA0" strokeWidth="1.5" />
            <line x1="18" y1="6" x2="18" y2="15" stroke="#5F9EA0" strokeWidth="2" />

            {/* Seat */}
            <rect x="15" y="3" width="6" height="2" rx="1" fill="#3B2F20" />

            {/* Handlebar */}
            <line x1="34" y1="4" x2="38" y2="4" stroke="#3B2F20" strokeWidth="1.5" />
            <line x1="34" y1="4" x2="36" y2="20" stroke="#3B2F20" strokeWidth="1" />
        </g>
    );
}
