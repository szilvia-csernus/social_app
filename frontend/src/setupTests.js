// https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib/src/test/setup.ts
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());