import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import AuditeeFill from "./pages/audteefill";
import AuditorFill from "./pages/audtorfill";
import SummerizeGoods from "./pages/summerizegoods";



function Routers() {
  return (
    <Router basename="/template">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/auditee" element={<AuditeeFill />} />
        <Route path="/auditor" element={<AuditorFill />} />
        <Route path="/summerizegoods" element={< SummerizeGoods/>} />
      </Routes>
    </Router>
  );
}

export default Routers;