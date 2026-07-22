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
Skip to content
itsfatima11
npc-generator
Repository navigation
Code
Issues
Pull requests
Actions
Projects
Wiki
Security and quality
Insights
Settings
Files
Go to file
t
T
dist
assets
index.html
node_modules
src
README.md
eslint.config.js
gitignore
index.html
package-lock.json
package.json
tsconfig.app.json
tsconfig.app.tsbuildinfo
tsconfig.json
tsconfig.node.json
tsconfig.node.tsbuildinfo
vite.config.ts
npc-generator
/dist/
author
itsfatima11
add .gitignore and project files
537a8ed
 · 
1 hour ago
Name	Last commit message	Last commit date
..
assets
add .gitignore and project files
1 hour ago
index.html
add .gitignore and project files
1 hour ago
Copied! 
