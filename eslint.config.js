import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {ignores:['dist/**','node_modules/**']},
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files:['**/*.{ts,tsx}'],
    plugins:{'react-hooks':reactHooks},
    languageOptions:{parserOptions:{projectService:true,tsconfigRootDir:import.meta.dirname}},
    rules:{
      '@typescript-eslint/no-explicit-any':'error',
      '@typescript-eslint/ban-ts-comment':'error',
      '@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}],
      'no-undef':'off',
      'react-hooks/rules-of-hooks':'error',
      'react-hooks/exhaustive-deps':'warn',
    },
  },
  {files:['eslint.config.js','vite.config.ts'],rules:{'@typescript-eslint/no-unused-vars':'off'}},
);
