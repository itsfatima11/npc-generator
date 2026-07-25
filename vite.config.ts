import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
plugins: [react()],
base: '/npc-generator/', // <-- این خط را اضافه کنید
});