import React from 'react';
import { Pizza, Clapperboard, Heart, Utensils, MapPin, Wallet, Coffee } from 'lucide-react';
import { Preset, WheelItem } from './types';

// A cozy pastel palette + Brand colors
export const WHEEL_COLORS = [
  '#FF9AA2', // Light Red
  '#FFB7B2', // Salmon
  '#FFDAC1', // Peach
  '#E2F0CB', // Lime Green
  '#B5EAD7', // Mint
  '#C7CEEA', // Periwinkle
  '#F49AC2', // Rose
  '#85E3FF', // Sky
];

// Helper to cycle colors
const getColor = (i: number) => WHEEL_COLORS[i % WHEEL_COLORS.length];

export const PRESETS: Preset[] = [
  {
    name: 'Budget Cravings',
    icon: <Wallet className="w-4 h-4" />,
    items: [
      { label: 'Jollibee', color: '#D50032', icon: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Jollibee_2011_logo.svg/1200px-Jollibee_2011_logo.svg.png', isImage: true },
      { label: 'Mang Inasal', color: '#00703C', icon: '🍗', isImage: false }, // Using Emoji as fallback for brand vibe
      { label: 'Fried Chicken', color: '#F59E0B', icon: '🍗', isImage: false },
      { label: 'Pizza', color: '#EF4444', icon: '🍕', isImage: false },
      { label: 'Noodles', color: '#FCD34D', icon: '🍜', isImage: false },
      { label: 'Fries', color: '#FDE047', icon: '🍟', isImage: false },
      { label: 'Corned Beef', color: '#EF4444', icon: '🥫', isImage: false },
      { label: 'Water', color: '#3B82F6', icon: '💧', isImage: false },
      { label: 'Coke', color: '#000000', icon: '🥤', isImage: false },
    ],
  },
  {
    name: 'Dinner',
    icon: <Utensils className="w-4 h-4" />,
    items: [
      { label: 'Pizza', color: getColor(0), icon: '🍕', isImage: false },
      { label: 'Sushi', color: getColor(1), icon: '🍣', isImage: false },
      { label: 'Burgers', color: getColor(2), icon: '🍔', isImage: false },
      { label: 'Tacos', color: getColor(3), icon: '🌮', isImage: false },
      { label: 'Thai', color: getColor(4), icon: '🍛', isImage: false },
      { label: 'Pasta', color: getColor(5), icon: '🍝', isImage: false },
      { label: 'Salad', color: getColor(6), icon: '🥗', isImage: false },
    ],
  },
  {
    name: 'Date Ideas',
    icon: <Heart className="w-4 h-4" />,
    items: [
      { label: 'Picnic', color: getColor(0), icon: '🧺', isImage: false },
      { label: 'Movie', color: getColor(1), icon: '🎬', isImage: false },
      { label: 'Walk', color: getColor(2), icon: '🌳', isImage: false },
      { label: 'Cooking', color: getColor(3), icon: '👨‍🍳', isImage: false },
      { label: 'Games', color: getColor(4), icon: '🎲', isImage: false },
    ],
  },
];
