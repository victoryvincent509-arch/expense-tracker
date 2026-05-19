export const CATEGORIES = [
  'Food',
  'Transport',
  'Tech/Tools',
  'Entertainment',
  'Data/Airtime',
  'Other'
];

export const CATEGORY_COLORS = {
  'Food': '#FF6B6B',
  'Transport': '#4ECDC4',
  'Tech/Tools': '#45B7D1',
  'Entertainment': '#96CEB4',
  'Data/Airtime': '#FFEAA7',
  'Other': '#DDA0DD'
};

// Extended color palette - Basic colors first (rainbow), then variations
const COLOR_PALETTE = [
  // Rainbow colors (basic)
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
  
  // Additional vibrant colors
  '#FF1493', // Deep Pink
  '#00CED1', // Dark Turquoise
  '#FF4500', // Orange Red
  '#32CD32', // Lime Green
  '#FFD700', // Gold
  '#8A2BE2', // Blue Violet
  '#DC143C', // Crimson
  '#00FA9A', // Medium Spring Green
  
  // Variations of basic colors
  '#FF6347', // Tomato (red variation)
  '#FFA500', // Orange
  '#F0E68C', // Khaki (yellow variation)
  '#90EE90', // Light Green
  '#87CEEB', // Sky Blue
  '#9370DB', // Medium Purple
  '#FF69B4', // Hot Pink
  '#20B2AA', // Light Sea Green
  '#FFB6C1', // Light Pink
  '#98FB98', // Pale Green
  '#DDA0DD', // Plum
  '#F4A460', // Sandy Brown
  '#BC8F8F', // Rosy Brown
  '#CD853F', // Peru
  '#D2691E', // Chocolate
  '#8B4513', // Saddle Brown
  '#A0522D', // Sienna
  '#6B8E23', // Olive Drab
  '#556B2F', // Dark Olive Green
  '#2E8B57'  // Sea Green
];

let colorIndex = 0;

// Get color for any category (predefined or custom)
export const getCategoryColor = (category) => {
  // If it's a predefined category, use its color
  if (CATEGORY_COLORS[category]) {
    return CATEGORY_COLORS[category];
  }
  
  // For custom categories, assign from palette
  // Use category name as seed for consistent colors
  const hash = category.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
};

export const FILTER_PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' }
];

export const CHART_TYPES = {
  PIE: 'pie',
  BAR: 'bar'
};