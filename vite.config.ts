```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
plugins: [react()],
base: '/npc-generator/',
test: {
environment: 'jsdom',
setupFiles: ['./src/test/setup.ts'],
coverage: { reporter: ['text', 'html'] },
},
})