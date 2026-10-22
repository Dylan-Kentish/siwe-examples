/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@repo/config/tailwind')],
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
};
