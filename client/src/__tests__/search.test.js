import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import "mutationobserver-shim"
import Search from '../components/Search'

test('test if "loading" message appears after submitting a search', async () => {

  render(<Search />)

  screen.getByRole('textbox', { name: 'Name' });
  userEvent.type(screen.getByRole('textbox', { name: 'Name' }), '1335 ASTOR');
  userEvent.click(screen.getByRole('button', {name: /Submit/i}));

  await waitFor(() => screen.findByText(/Loading/i));

  expect(screen.getByText(/Loading.../i)).toHaveTextContent('Loading...');

})
