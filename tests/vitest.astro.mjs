import { expect } from 'vitest';
import { loadEnv } from 'vite';

import '@testing-library/jest-dom';

loadEnv('', process.cwd());

export { expect };
