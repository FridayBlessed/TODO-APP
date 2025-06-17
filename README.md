
# React Todo Application

A comprehensive Todo application built with React that demonstrates modern frontend engineering skills including API integration, routing, state management, and accessible user interfaces.

## 🚀 Features

### Core Functionality
- **Todo Listing with Pagination**: Display todos with 10 items per page pagination
- **Todo Detail Pages**: Individual pages for each todo with full details
- **Search & Filter**: Search by title and filter by completion status
- **Full CRUD Operations**: Create, Read, Update, and Delete todos
- **Error Handling**: Custom error boundary and 404 page
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### Technical Features
- **API Integration**: JSONPlaceholder API with React Query for caching
- **Modern React**: Functional components with hooks
- **Client-side Routing**: React Router v6 with nested routes
- **Form Handling**: React Hook Form with validation
- **UI Components**: ShadCN/UI component library
- **Styling**: Tailwind CSS with consistent design system

## 🛠️ Technology Stack

- **React**: Frontend framework
- **React Router**: Client-side routing
- **React Query (TanStack Query)**: API state management and caching
- **React Hook Form**: Form handling and validation
- **ShadCN/UI**: Modern component library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Vite**: Build tool and dev server

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd react-todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🌐 API Integration

The application uses the JSONPlaceholder API for demo purposes:

- **Base URL**: `https://jsonplaceholder.typicode.com`
- **Endpoints Used**:
  - `GET /todos?_limit=50` - Fetch limited todos (50 items)
  - `GET /todos/{id}` - Fetch single todo
  - `POST /todos` - Create new todo
  - `PUT /todos/{id}` - Update existing todo
  - `DELETE /todos/{id}` - Delete todo

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # ShadCN/UI components
│   ├── ErrorBoundary.jsx   # Error boundary component
│   └── TodoDialog.jsx      # Todo create/edit modal
├── pages/
│   ├── Index.jsx          # Home page (redirects to todos)
│   ├── Todos.jsx          # Main todos listing page
│   ├── TodoDetail.jsx     # Individual todo detail page
│   └── NotFound.jsx       # 404 error page
├── App.jsx                # Main app component with routing
└── main.jsx              # Application entry point
```

## ✨ Key Features Explained

### Pagination
- Client-side pagination with 10 items per page
- Page navigation with previous/next buttons
- Numbered page links for direct navigation

### Search and Filtering
- Real-time search by todo title
- Filter by completion status (All/Completed/Incomplete)
- Combined search and filter functionality

### CRUD Operations
- **Create**: Add new todos via modal form
- **Read**: View todos in list and detail pages
- **Update**: Edit existing todos with pre-populated form
- **Delete**: Remove todos with confirmation dialog

### Error Handling
- React Error Boundary for catching JavaScript errors
- Custom 404 page for undefined routes
- Test route (`/error-test`) to demonstrate error boundary
- Toast notifications for API operation feedback

### Accessibility
- Semantic HTML elements (`<main>`, `<nav>`, `<section>`)
- ARIA labels and roles throughout the application
- Keyboard navigation support
- Screen reader friendly content
- Focus management and visual indicators
- Color contrast compliance (WCAG AA)

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive grid layouts and navigation
- Touch-friendly interface elements
- Optimized for both mobile and desktop

## 🎯 Usage

1. **View Todos**: Navigate to the main page to see paginated todo list
2. **Search**: Use the search bar to find specific todos by title
3. **Filter**: Use the dropdown to filter by completion status
4. **Create Todo**: Click "Add Todo" button to create new todos
5. **View Details**: Click on any todo title to view full details
6. **Edit Todo**: Use the "Edit Todo" button on detail pages
7. **Delete Todo**: Use the "Delete Todo" button with confirmation
8. **Navigate**: Use pagination controls to browse through todos

## 🐛 Known Issues

- API operations are simulated (JSONPlaceholder doesn't persist changes)
- Limited to 50 todos to keep the demo manageable
- Some API responses may be slower due to external service

## 🔮 Future Improvements

### Planned Features
- **Data Persistence**: Local storage integration
- **Offline Support**: Service worker implementation
- **User Authentication**: Login/logout functionality
- **Categories/Tags**: Todo organization system
- **Due Dates**: Time-based todo management
- **Sorting Options**: Multiple sorting criteria
- **Bulk Operations**: Select and manage multiple todos
- **Export/Import**: Data backup and restore

### Technical Enhancements
- **Progressive Web App**: PWA capabilities
- **Dark Mode**: Theme switching functionality
- **Performance**: Virtual scrolling for large lists
- **Testing**: Comprehensive test suite
- **Animation**: Smooth transitions and micro-interactions

## 📄 License

This project is created for educational purposes and demonstration of React development skills.

---

Built with ❤️ using Typescript & React and modern web technologies.
