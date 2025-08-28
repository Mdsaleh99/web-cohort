import { render, screen } from '@testing-library/react';
import Contact from '../Contact';
import '@testing-library/jest-dom';

// * Describe block is used to group the test cases
describe('Contact Us Page Test Case', () => {
  // beforeAll(() => {
  //   console.log('Before All');
  // });

  // afterAll(() => {
  //   console.log('After All');
  // });

  // afterEach(() => {
  //   console.log('After Each');
  // });

  // beforeEach(() => {
  //   console.log('Before Each');
  // });

  test('Should load Contact component', () => {
    render(<Contact />);

    const heading = screen.getByRole('heading');

    // * Assertion
    expect(heading).toBeInTheDocument();
  });

  test('Should load button inside Contact component', () => {
    render(<Contact />);

    const button = screen.getByRole('button');
    // const button = screen.getByText('Random');

    // * Assertion
    expect(button).toBeInTheDocument();
  });

  // * Note: test() or it() both are same

  it('Should input name inside Contact component', () => {
    render(<Contact />);

    const inputName = screen.getByPlaceholderText('name');

    // * Assertion
    expect(inputName).toBeInTheDocument();
  });

  it('Should load 2 input boxes on the Contact component', () => {
    render(<Contact />);

    // * Querying
    const inputBoxes = screen.getAllByRole('textbox'); // getAllByRole - returns multiple elements

    // console.log(inputBoxes.length); // returns jsx element

    // * Assertion
    // expect(inputBoxes.length).toBe(2);
    expect(inputBoxes.length).not.toBe(3); // not here means inverse
  });
});
