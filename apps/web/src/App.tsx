import { Route, Routes } from "react-router-dom";
import { CatalogFilterBar } from "./features/catalog/CatalogFilterBar";
import { EventList } from "./features/catalog/EventList";
import { EventPage } from "./features/event/EventPage";

export function App() {
  return (
    <main className="page">
      <header className="page__header">
        <h1>EventHub</h1>
        <p className="page__subtitle">Квитки на події</p>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <CatalogFilterBar />
              <EventList />
            </>
          }
        />
        <Route path="/events/:eventId" element={<EventPage />} />
      </Routes>
    </main>
  );
}
