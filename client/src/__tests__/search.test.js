import * as React from 'react'
import {render, screen, waitForElement, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import "mutationobserver-shim"
import Search from '../components/Search'

jest.setTimeout(30000);

test('test if "loading" message appears after submitting a search', async () => {

  render(<Search />)

  screen.getByRole('textbox', { name: 'Name' });
  userEvent.type(screen.getByRole('textbox', { name: 'Name' }), '1335 ASTOR');
  userEvent.click(screen.getByRole('button', {name: /Submit/i}));

  await waitFor(() => screen.findByText(/Loading/i), {timeout:5000});

  expect(screen.getByText(/Loading.../i)).toHaveTextContent('Loading...');

})
