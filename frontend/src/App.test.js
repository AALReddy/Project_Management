import { render, screen } from '@testing-library/react';
import App from './App';

test('renders landing page', () => {
  render(<App />);

  // Landing header uses "Ease2Work"
  expect(screen.getByRole('heading', { name: /Ease2Work/i })).toBeInTheDocument();
  expect(screen.getByText(/Manage Your Projects with Ease/i)).toBeInTheDocument();
});
