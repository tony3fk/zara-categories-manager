# ZARA Categories Manager

A modern web application for managing ZARA.COM product categories, allowing flexible organization of products in rows with different alignments.

## Features

- **Product Organization**:

  - Organize products in rows (1-3 products per row)
  - Drag & Drop functionality for products and rows
  - Smart alignment controls (disabled for 0 or 3 products)
  - Visual feedback during drag operations

- **Layout Management**:

  - Three alignment templates: left, center, right
  - Row reordering through drag & drop
  - Product position swapping within rows
  - Fixed-width rows for consistent layout

- **Visual Features**:

  - Zoom in/out functionality for better overview
  - Elevation shadows and smooth transitions
  - Modern and clean UI design
  - Responsive product cards with hover effects

- **User Experience**:

  - Intuitive product selection panel
  - Visual feedback for all interactions
  - Smooth animations and transitions
  - Clear alignment controls with icons

- **Testing**:
  - Comprehensive unit tests with Jest and React Testing Library
  - Component-level testing with styled-components support
  - Mock implementations for drag and drop functionality
  - Visual style testing for hover states and transitions

## Technologies Used

- React 18 + TypeScript
- Vite
- Styled Components
- React DnD (Drag and Drop)
- Context API for state management
- Jest + React Testing Library
- jest-styled-components

## Requirements

- Node.js 16 or higher
- npm 7 or higher

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd zara-categories-management
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Run the tests:

```bash
npm test
```

The application will be available at `http://localhost:5173`

## Usage

1. **Adding Products**:

   - Use the left sidebar to select products
   - Click on a product to add it to the last row
   - Maximum 3 products per row

2. **Managing Rows**:

   - Click "Add Row" to create a new row
   - Drag rows using the handle on the left
   - Remove rows using the trash icon

3. **Organizing Products**:

   - Drag products between rows
   - Reorder products within rows
   - Remove products using the 'x' button

4. **Alignment Control**:

   - Select alignment for rows with 1-2 products
   - Controls are automatically disabled for 0 or 3 products
   - Visual feedback shows current alignment

5. **Zoom Control**:
   - Use zoom controls in the bottom right
   - Zoom in/out for better overview
   - Reset zoom to default view

## Project Structure

```
src/
  ├── components/          # React components
  │   ├── AddProduct/     # Product selection panel
  │   ├── Logo/           # ZARA logo component
  │   ├── Row/            # Row management
  │   └── ZoomControls/   # Zoom functionality
  ├── context/            # React Context for state
  ├── hooks/              # Custom React hooks
  ├── styles/             # Global styles
  ├── types/              # TypeScript types
  ├── utils/              # Utilities and helpers
  └── __tests__/         # Test files
```

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Testing individual components and hooks
- **Integration Tests**: Testing component interactions
- **Style Tests**: Testing styled-components and visual states
- **Mock Tests**: Testing drag and drop functionality

Run tests with:

```bash
npm test               # Run all tests
npm run test:watch    # Run tests in watch mode
```

## Technical Decisions

1. **TypeScript**: Full type safety and better developer experience
2. **Vite**: Modern and fast build tool
3. **Styled Components**: Component-level styling with theme support
4. **React DnD**: Robust drag and drop functionality
5. **Context API**: Simple and effective state management
6. **Fixed Width Layout**: Consistent product display regardless of content
7. **Jest + RTL**: Comprehensive testing solution
8. **jest-styled-components**: Advanced style testing capabilities

## Component Architecture

- **Logo**: Standalone component for branding
- **AddProduct**: Fixed sidebar for product selection
- **Row**: Complex component handling:
  - Product alignment
  - Drag and drop
  - Product management
  - Visual feedback
- **ZoomControls**: Global view management

## Future Improvements

- [ ] Data persistence
- [ ] Undo/Redo functionality
- [ ] Category preview mode
- [ ] Configuration import/export
- [ ] Dark mode support
- [x] Unit and integration tests
- [ ] Keyboard navigation
- [ ] Multi-language support
- [ ] Performance optimizations for large catalogs
- [ ] E2E testing with Cypress or Playwright

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
