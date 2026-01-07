import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { HelmetProvider } from 'react-helmet-async';

// Mock matchMedia for window if needed, though RTL usually doesn't need it for basic layout unless using a hook that relies on it.
// However, scrollBy is not implemented in JSDOM. We need to mock it.
// Ref: https://github.com/jsdom/jsdom/issues/1422

beforeAll(() => {
    Element.prototype.scrollBy = jest.fn();
});

test('renders all 5 categories', () => {
    render(
        <HelmetProvider>
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        </HelmetProvider>
    );

    const categories = [
        'Electronics',
        'Fashion',
        'Home & Furniture',
        'TV & Appliances',
        'Mobiles & Tablets'
    ];

    categories.forEach(cat => {
        expect(screen.getByText(cat)).toBeInTheDocument();
    });
});

test('renders scroll arrows when categories > 3', () => {
    render(
        <HelmetProvider>
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        </HelmetProvider>
    );

    const prevButton = screen.getByLabelText('Previous categories');
    const nextButton = screen.getByLabelText('Next categories');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Test click interaction
    fireEvent.click(nextButton);
    expect(Element.prototype.scrollBy).toHaveBeenCalled();
});
