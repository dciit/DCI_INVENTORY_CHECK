import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import App from "./App";
import AuditeeFill from "./pages/audtee.check";
import SummerizeGoods from "./pages/summarygoods";
import GenTag from "./pages/gentag";
import Login from "./pages/login";
import HomePage from "./pages/home.page";
import AuditeeScanData from "./pages/scandata.auditee";
import AuditorScanData from "./pages/scandata.auditor";
import FinalSumAuditee from "./pages/finalsum.auditee";
import DetailSumAuditee from "./pages/detailsum.auditee";
import CompareSummary from "./pages/comparesum";
import DetailCompareSum from "./pages/detailcomparesum";
import CameraPage from "./CameraPage";
import AuditorFill from "./pages/audtor.check";
import DetailSumAuditor from "./pages/detailsum.auditor";





function Routers() {
  return (
    <Router basename="/ivcount">
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/auditeecheck" element={<AuditeeFill />} />
        <Route path="/auditorcheck" element={<AuditorFill />} />

        <Route path="/summerizegoods" element={< SummerizeGoods />} />
        <Route path='/gentag' element={<GenTag />} />
        <Route path="/scanqradtee" element={<AuditeeScanData />} />
        <Route path="/scanqradtor" element={<AuditorScanData />} />

        <Route path="/adtesumfinal" element={<FinalSumAuditee />} />
        <Route path="/adtedetailsum" element={<DetailSumAuditee />} />

        <Route path="/adtorsumfinal" element={<FinalSumAuditee />} />
        <Route path="/adtordetailsum" element={<DetailSumAuditor />} />

        <Route path="/comparesum" element={<CompareSummary />} />
        <Route path="/detailcomparesum" element={<DetailCompareSum />} />

        <Route path="/scan" element={<CameraPage />} />
        <Route path="/test" element={<CameraPage />} />
      </Routes>
    </Router>
  );
}

export default Routers;