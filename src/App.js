import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WorkflowInterface from "./components/WorkflowInterface/WorkflowInterface";
import DocumentationPage from "./components/WorkflowInterface/DocumentationPreview/PreviewPage/DocumentationPage";
import PublicDocumentationPage from "./components/WorkflowInterface/DocumentationPreview/PublicPage/PublicDocumentationPage";
import ProductTourPage from "./components/WorkflowInterface/ProductTourPreview/PreviewPage/ProductTourPreview";
import PublicProductTour from './components/WorkflowInterface/ProductTourPreview/PublicPage/PublicProductTour';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main workflow at root */}
          <Route path="/" element={<WorkflowInterface />} />

          {/* Share/Preview page */}
          <Route path="/share/documentation" element={<DocumentationPage />} />
          <Route path="/share/documentation/:id" element={<PublicDocumentationPage />} />
          <Route path="/share/product-tour" element={<ProductTourPage/>} />
          <Route path="/share/product-tour/:id" element={<PublicProductTour/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
