import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // السماح باستخدام الشبكة
    allowedHosts: [
      'a9f6419e-6aeb-417b-8fd6-3f435633a888-00-38q5sz3h8p1g6.spock.replit.dev', // إضافة المضيف هنا
    ],
  },
});