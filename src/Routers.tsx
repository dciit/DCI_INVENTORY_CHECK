import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import App from "./App";
import AuditeeFill from "./pages/auditee/audtee.check";
import SummerizeGoods from "./pages/auditee/summarygoods";
import GenTag from "./pages/reports/gentag";
import Login from "./pages/login";
import HomePage from "./pages/home.page";
import AuditeeScanData from "./pages/auditee/scandata.auditee";
import AuditorScanData from "./pages/auditor/scandata.auditor";
import FinalSumAuditee from "./pages/auditee/finalsum.auditee";
import DetailSumAuditee from "./pages/auditee/detailsum.auditee";
import CompareSummary from "./pages/comparesum";
import DetailCompareSum from "./pages/detailcomparesum";
import AuditorFill from "./pages/auditor/audtor.check";
import DetailSumAuditor from "./pages/auditor/detailsum.auditor";
import SumAuditeeScan from "./pages/auditee/sum.auditee .scan";
import FinalSumAiditor from "./pages/auditor/finalsum.auditor";
import TagHistoryAuditor from "./pages/auditor/tagauditor.history";
import TagHistoryAuditee from "./pages/auditee/tagauditee.history";
import Layout from "./Layout";





function Routers() {



  return (
    <Router basename="/ivcount">
      <Routes>
        <Route element = {<Layout/>} >
          <Route path="/*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<HomePage />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/auditeecheck" element={<AuditeeFill />} />
          <Route path="/auditorcheck" element={<AuditorFill />} />

          <Route path="/summerizegoods" element={< SummerizeGoods />} />
          <Route path='/gentag' element={<GenTag />} />

          <Route path="/scanqradtee" element={<AuditeeScanData />} />
          <Route path="/sumscanqradtee" element={<SumAuditeeScan />} />

          <Route path="/scanqradtor" element={<AuditorScanData />} />

          <Route path="/adtesumfinal" element={<FinalSumAuditee />} />
          <Route path="/adtedetailsum" element={<DetailSumAuditee />} />
          <Route path="/historyauditee" element={<TagHistoryAuditee />} />

          <Route path="/adtorsumfinal" element={<FinalSumAiditor />} />
          <Route path="/adtordetailsum" element={<DetailSumAuditor />} />
          <Route path="/historyauditor" element={<TagHistoryAuditor />} />

          <Route path="/comparesum" element={<CompareSummary />} />
          <Route path="/detailcomparesum" element={<DetailCompareSum />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Routers;