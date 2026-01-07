import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductsPage from './ProductsPage';
import { HelmetProvider } from 'react-helmet-async';
import api from '../utils/api';

// Mock API
jest.mock('../utils/api');

const renderWithRouter = (initialEntries = ['/products']) => {
    return render(
        <HelmetProvider>
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/products" element={<ProductsPage />} />
                </Routes>
            </MemoryRouter>
        </HelmetProvider>
    );
};

test('renders subcategories for Electronics and shows product types on click', async () => {
    // Setup API mock
    api.get.mockResolvedValue({ data: [] });

    // Render page with Category=Electronics
    renderWithRouter(['/products?category=Electronics']);

    // Check main category is loaded
    expect(await screen.findByText(/Browse Electronics/i)).toBeInTheDocument();

    // Find subcategory button logic
    const audioBtn = screen.getByText('Audio');
    expect(audioBtn).toBeInTheDocument();

    // Click Audio subcategory logic logic
    fireEvent.click(audioBtn);

    // Verify Product Type items appear
    expect(await screen.findByText('Bluetooth Headphones')).toBeInTheDocument();
    expect(screen.getByText('Soundbars')).toBeInTheDocument();
    expect(screen.getByText('Audio Categories')).toBeInTheDocument();
});
