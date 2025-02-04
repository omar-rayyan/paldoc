import NotFound from "./components/NotFound.jsx";

function App() {
  return (
    <Routes>
        <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;