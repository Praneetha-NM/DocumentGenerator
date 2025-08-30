import { useState, useEffect, useRef } from "react";
import "./styles/DocumentationPage.css";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function DocumentationPage() {
  const [searchParams] = useSearchParams();
  const steps = JSON.parse(searchParams.get("steps") || "[]");
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id || 1);
  const navigate = useNavigate();

  // Modal state
  const [shareLink, setShareLink] = useState("");
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef(null);

  const handleShare = () => {
    const id = uuidv4(); // Unique ID
    localStorage.setItem(`shared-steps-${id}`, JSON.stringify(steps));

    const url = `${window.location.origin}/share/documentation/${id}`;
    setShareLink(url);
    setShowModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return; // Add null check
  
      const stepElements = contentRef.current.querySelectorAll(".instruction-block");
      let closestStepId = null;
      let closestDistance = Infinity;
  
      stepElements.forEach((stepElement) => {
        const { top } = stepElement.getBoundingClientRect();
        const stepId = Number(stepElement.dataset.stepId);
  
        if (Math.abs(top) < closestDistance) {
          closestDistance = Math.abs(top);
          closestStepId = stepId;
        }
      });
  
      if (closestStepId !== null) {
        setCurrentStepId(closestStepId);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [steps]);

  return (
    <div className="guide-root">
      {/* Header Bar */}
      <div className="share-header">
        <button
          className="header-btn back-btn"
          onClick={() =>
            navigate("/", {
              state: { steps }, // Pass steps array back to the edit page
            })
          }
        >
          Back to Edit
        </button>
        <button className="header-btn confirm-btn" onClick={handleShare}>
          Share
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Share via Link</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="share-link-input"
              />
              <button className="copy-btn" onClick={handleCopy}>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Panel */}
      <div className="nav-panel">
        <div className="nav-panel-sticky">
          <div className="panel-header">
            <h2 className="contents-heading">TABLE OF CONTENTS</h2>
          </div>
          <nav className="section-nav">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStepId(step.id)}
                className={`nav-link ${
                  currentStepId === step.id ? "nav-link-current" : ""
                }`}
              >
                {step.description}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Primary Content */}
      <div className="primary-area" ref={contentRef}>
        <div className="inner-container">
          <div className="header-block">
            <h1 className="main-title">Capture 2025-08-20 → T19:00</h1>
          </div>
          <div className="instructions-list">
            {steps.map((step) => (
              <div
                key={step.id}
                className="instruction-block"
                data-step-id={step.id}
              >
                <div className="instruction-card">
                  <div className="instruction-row">
                    <div className="step-indicator">{step.id}</div>
                    <div className="instruction-body">
                      <h3 className="instruction-heading">{step.description}</h3>
                      <div className="instruction-content">
                        {step.extra && <p className="instruction-text">{step.extra}</p>}
                        {step.screenshot && (
                          <div className="screenshot-wrapper">
                            <img
                              src={step.screenshot}
                              alt={`Screenshot for ${step.description}`}
                              className="screenshot-image"
                            />
                            {step.circleX && step.circleY && (
                              <div
                                className="outer-circle"
                                style={{
                                  top: step.circleY,
                                  left: step.circleX,
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                <div className="inner-circle"></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentationPage;