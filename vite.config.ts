```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
plugins: [react()],
base: '/npc_generator/', // <--- این خط رو اینجا اضافه کن (بین plugins و test)
test: {
environment: 'jsdom',
setupFiles: ['./src/test/setup.ts'],
coverage: { reporter: ['text', 'html'] },
},
});
``
