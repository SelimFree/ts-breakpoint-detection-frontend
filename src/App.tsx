import "./App.scss"

import { Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage/MapPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import Layout from "./components/Layout";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />} >
        <Route path="/" element={<MapPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>
    </Routes>
  )
}

export default App
