// Retro Autumn Game Theme — Color Tokens & Constants

export const THEME = {
  colors: {
    bgPrimary: '#2D1B0E',
    bgSecondary: '#3E2A1A',
    bgCard: '#4A3425',
    road: '#8B6F47',
    roadBorder: '#6B5233',
    roadDash: '#A89070',
    accentWarm: '#E8943A',
    accentGold: '#DAA520',
    accentRed: '#C0392B',
    textPrimary: '#F5E6D3',
    textSecondary: '#B8A08A',
    textMuted: '#8A7560',
    foliageGreen: '#556B2F',
    foliageOrange: '#D2691E',
    foliageBrown: '#8B4513',
    skyWarm: '#E8C99B',
    leafRed: '#B22222',
    leafYellow: '#DAA520',
    leafOrange: '#CC7722',
  },
  fonts: {
    heading: "'Caveat', cursive",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
};

// Station definitions — order matches road stops
export const STATIONS = [
  {
    id: 'welcome',
    label: 'Welcome',
    signText: 'Starting Point',
    roadPercent: 0, // 0% of road path
  },
  {
    id: 'philosophy',
    label: 'My Philosophy',
    signText: 'Process > Outcome',
    roadPercent: 14,
  },
  {
    id: 'casestudy',
    label: 'Case Study',
    signText: 'Portfolio Stabilization',
    roadPercent: 28,
  },
  {
    id: 'blueprint',
    label: 'Blueprint',
    signText: 'System Framework',
    roadPercent: 42,
  },
  {
    id: 'experience',
    label: 'Experience',
    signText: 'The Journey',
    roadPercent: 56,
  },
  {
    id: 'skills',
    label: 'Skills & AI',
    signText: 'Toolset',
    roadPercent: 70,
  },
  {
    id: 'contact',
    label: 'Contact',
    signText: 'Destination',
    roadPercent: 100,
  },
];

// Road SVG path data — a winding path that zigzags across the viewport
// The viewBox is 1000 x 7000 (tall page)
export const ROAD_PATH = 'M 500 0 C 500 200 800 300 750 500 S 200 700 250 900 S 800 1100 700 1300 S 200 1500 300 1700 S 800 1900 700 2100 S 200 2300 300 2500 S 800 2700 700 2900 S 300 3100 500 3300';

export default THEME;
