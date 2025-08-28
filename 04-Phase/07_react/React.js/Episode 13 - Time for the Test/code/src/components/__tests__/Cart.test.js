import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import RestaurantMenu from '../RestaurantMenu';
import MOCK_DATA_NAME from '../mocks/mockResMenu.json';
import { Provider } from 'react-redux';
import appStore from '../../utils/appStore';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn(() => {
  return Promise.resolve({
    json: () => Promise.resolve(MOCK_DATA_NAME),
  });
});

it('should load Restauarant Menu component', async () => {
  await act(async () =>
    render(
      <BrowserRouter>
        <Provider store={appStore}>
          <RestaurantMenu />
        </Provider>
      </BrowserRouter>
    )
  );

  const accordionHeader = screen.getByText('London Doners (7)');
  fireEvent.click(accordionHeader);

  expect(screen.getAllByTestId('foodItems').length);
});
