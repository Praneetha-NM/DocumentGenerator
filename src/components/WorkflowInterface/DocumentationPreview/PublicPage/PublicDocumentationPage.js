import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function PublicDocumentationPage() {
  const { id } = useParams();
  const [steps, setSteps] = useState([]);
  const [currentStepId, setCurrentStepId] = useState(1);
  const contentRef = useRef(null);

  // Fetch steps from local storage
  useEffect(() => {
    const storedSteps = localStorage.getItem(`shared-steps-${id}`);
    if (storedSteps) {
      setSteps(JSON.parse(storedSteps));
    }
  }, [id]);

  // Scroll tracking logic
  useEffect(() => {
    const handleScroll = () => {
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

  // Smooth scroll to the step
  const handleNavClick = (stepId) => {
    const targetElement = contentRef.current.querySelector(`[data-step-id="${stepId}"]`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="guide-root" style={{ paddingTop: "10px" }}>
      

      {/* Navigation Panel */}
      <div className="nav-panel">
        <div className="nav-panel-sticky">
          <div className="panel-header">
            <svg
              className="icon-book"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            <h2 className="contents-heading">TABLE OF CONTENTS</h2>
          </div>

          <nav className="section-nav">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => handleNavClick(step.id)}
                className={`nav-link ${
                  step.id === currentStepId ? "nav-link-current" : ""
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
                        {step.extra && (
                          <p className="instruction-text">{step.extra}</p>
                        )}
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

export default PublicDocumentationPage;