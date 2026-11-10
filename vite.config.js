import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        services: 'services.html',
        studio: 'studio.html',
        work: 'work.html',
        contact: 'contact.html'
      }
    }
  }
});
