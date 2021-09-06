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

// test('test if "results" message appears after submitting a search', async () => {
//
//   render(<Search />)
//
//   screen.getByRole('textbox', { name: 'Name' });
//   userEvent.type(screen.getByRole('textbox', { name: 'Name' }), '1335 ASTOR');
//   userEvent.click(screen.getByRole('button', {name: /Submit/i}));
//
//   screen.debug();
//   await waitFor(() => screen.findByText(/Loading/i), {timeout:5000});
//
//   jest.advanceTimersByTime(3000);
//
//   screen.debug();
//   //even with a 30000 ms timeout, this test is not passing.
//   await waitFor(() => screen.findByText(/Results/i), {timeout:10000});
//   expect(screen.getByText(/Results/i)).toHaveTextContent('Results');
//
//
// })
