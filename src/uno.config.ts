import { defineConfig, presetUno, presetAttributify, presetIcons, presetTypography } from 'unocss';
import presetUna from '@una-ui/preset';
import { extractorSplit } from '@unocss/core';
import presetScriptVueExtractor from '@una-ui/extractor-vue-script';

const colorPreset = {
  primary: {
    '50': '#f0f8ff',
    '100': '#e0f1fe',
    '200': '#bae3fd',
    '300': '#7ccdfd',
    '400': '#36aff7',
    '500': '#0c96e6',
    '600': '#0178c3',
    '700': '#0163a1',
    '800': '#065383',
    '900': '#0b466d',
    '950': '#082b46',
    DEFAULT: '#0c96e6',
    lightest: '#e0f1fe',
    light: '#7ccdfd',
    dark: '#0178c3',
  },
  success: {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16',
    DEFAULT: '#22c55e',
    lightest: '#dcfce7',
    light: '#86efac',
    dark: '#16a34a',
  },
  danger: {
    '50': '#fef2f2',
    '100': '#fee2e2',
    '200': '#fecaca',
    '300': '#fca5a5',
    '400': '#f87171',
    '500': '#ef4444',
    '600': '#dc2626',
    '700': '#b91c1c',
    '800': '#991b1b',
    '900': '#7f1d1d',
    '950': '#450a0a',
    DEFAULT: '#ef4444',
    lightest: '#fee2e2',
    light: '#fca5a5',
    dark: '#dc2626',
  },
  accent: {
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#fecdd3',
    '300': '#fda4af',
    '400': '#fb7185',
    '500': '#f43f5e',
    '600': '#e11d48',
    '700': '#be123c',
    '800': '#9f1239',
    '900': '#881337',
    '950': '#4c0519',
    DEFAULT: '#f43f5e',
    lightest: '#ffe4e6',
    light: '#fda4af',
    dark: '#e11d48',
  },
  background: '#f8fafc', // Light background
};

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetUna({
      colors: colorPreset,
      dark: 'class',
    }),
    presetTypography(),
  ],
  extractors: [
    extractorSplit,
    presetScriptVueExtractor(),
  ],
  theme: {
    fontFamily: {
      sans: "'Inter var', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    colors: {
      ...colorPreset,
    },
  },
}); 