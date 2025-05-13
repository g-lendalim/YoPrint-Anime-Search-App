import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import AnimeSearchPage from "./pages/AnimeSearchPage";
import AnimeDetailsPage from "./pages/AnimeDetailsPage";

function Layout() {
  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand className="ms-3">Anime Search App</Navbar.Brand>
      </Navbar>
      <Outlet />
    </>
  );
}

export default function App() {
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
