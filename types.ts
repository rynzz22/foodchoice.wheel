export interface WheelItem {
  id: string;
  label: string; // The text to show (or name of the item)
  color: string;
  icon?: string; // Emoji or Image URL
  isImage?: boolean; // if true, render as <image>, else text/emoji
}

export interface Preset {
  name: string;
  icon: React.ReactNode;
  items: Omit<WheelItem, 'id'>[]; // Presets define items without IDs
}
