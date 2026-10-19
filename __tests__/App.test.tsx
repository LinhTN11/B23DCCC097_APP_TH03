import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders correctly', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(<App />);
    jest.runAllTimers();
  });
  expect(tree).toBeDefined();
});
