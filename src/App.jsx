import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import AnimeSearchPage from './pages/AnimeSearchPage';
import AnimeDetailsPage from './pages/AnimeDetailsPage';

export default function App() {
  function Layout() {
   return (
      <div>
        <Navbar expand="lg" className="bg-primary">
          <Container fluid>
            <Navbar.Brand className="text-white">Anime Search App</Navbar.Brand>
          </Container>
        </Navbar>
        <Outlet />
      </div>
    ) 
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/search" element={<AnimeSearchPage />} />
          <Route path="/anime/:id" element={<AnimeDetailsPage />} />
          <Route path="*" element={<AnimeSearchPage />} />
        </Route>
      </Routes>
    </BrowserRouter>  
  );
}