import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about/index.html'),
          faqs: path.resolve(__dirname, 'faqs/index.html'),
          vagas: path.resolve(__dirname, 'vagas/index.html'),
          connect: path.resolve(__dirname, 'connect/index.html'),
          recruit: path.resolve(__dirname, 'recruit/index.html'),
          outsourcing: path.resolve(__dirname, 'outsourcing/index.html'),
          consulting: path.resolve(__dirname, 'consulting/index.html'),
          studio: path.resolve(__dirname, 'studio/index.html'),
          services: path.resolve(__dirname, 'services/index.html'),
          profissionais: path.resolve(__dirname, 'profissionais/index.html'),
          terms: path.resolve(__dirname, 'terms/index.html'),
        },
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'src': path.resolve(__dirname, 'src'),
        'scr': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
