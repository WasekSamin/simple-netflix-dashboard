import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MoviesPage from "./pages/MoviesPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import AddMoviePage from "./pages/AddMoviePage";
import AddUserPage from "./pages/AddUserPage";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import LoginPage from "./pages/LoginPage";
import EditUserPage from "./pages/EditUserPage";
import AddGenrePage from "./pages/AddGenrePage";
import GenresPage from "./pages/GenresPage";
import EditGenrePage from "./pages/EditGenrePage";
import EditMoviePage from "./pages/EditMoviePage";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthGuard>
            <Routes>
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/" element={<Index />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/add" element={<AddMoviePage />} />
              <Route path="/movies/:id" element={<EditMoviePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/users/add" element={<AddUserPage />} />
              <Route path="/users/:id" element={<EditUserPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/genres/add" element={<AddGenrePage />} />
              <Route path="/genres/:id" element={<EditGenrePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthGuard>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
