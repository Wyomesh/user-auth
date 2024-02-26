import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthenticationPage from "./components/AuthenticationPage";
import Authorization from "./components/Authorization";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route index element={<Authorization />} /> */}
          <Route path="/" element={<AuthenticationPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
