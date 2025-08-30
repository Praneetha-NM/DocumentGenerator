"use client"

import { useState, useEffect, useRef } from "react"
import gmailScreenshot from '../../../assets/gmail_screenshot.png';
import { useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ProductTourPage() {
  // Check if localStorage is available (for client-side execution)
  const isClient = typeof window !== 'undefined';
  const navigate = useNavigate();

  // Modal state
  const [shareLink, setShareLink] = useState("");
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef(null);

  const handleShare = () => {
    const id = uuidv4(); // Unique ID
    localStorage.setItem(`shared-steps-${id}`, JSON.stringify(steps));

    const url = `${window.location.origin}/share/product-tour/${id}`;
    setShareLink(url);
    setShowModal(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
  };
  
  const [searchParams] = useSearchParams();
  const steps = JSON.parse(searchParams.get("steps") || "[]");
  const [currentStep, setCurrentStep] = useState(0);
  
  // Save steps to localStorage when they change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("workflowSteps", JSON.stringify(steps));
    }
  }, [steps, isClient]);

  const goToPrevious = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const step = steps[currentStep];

  return (
    <div className="tutorial-wrapper">
      {/* Header */}
      <div className="share-header">
        <button
          className="header-btn back-btn"
          onClick={() =>
            navigate("/", {
              replace: true, // prevents duplicate history entry
              state: { activeTab: "Product Tour" }
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
      <div className="product-tour">
      <div className="tutorial-header">
        <h1 className="capture-timestamp">Capture 2025-08-20 → T19:00</h1>
      </div>

      {/* Main Content */}
      <div className="tutorial-body">
        {/* Left Side - Image */}
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

        {/* Right Side - Content */}
        <div className="instruction-wrapper">
          <div className="instruction-content">
            <h2 className="instruction-title">{step.description}</h2>
            <p className="instruction-description">{step.extra}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-wrapper">
        <div className="step-navigator">
          <button 
            onClick={goToPrevious} 
            disabled={currentStep === 0}
            className="prev-button"
          >
            <FaChevronLeft />
          </button>

          <span className="step-counter">
            Step {currentStep + 1} of {steps.length}
          </span>

          <button
            onClick={goToNext}
            disabled={currentStep === steps.length - 1}
            className="next-button"
          >
            <FaChevronRight />
          </button>
        </div>
        </div>
      </div>

      <style jsx>{`
        .tutorial-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 500px;
          max-width: 90%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 20px;
          
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .modal-body {
          padding: 2px;
          display: flex;
          gap: 10px;
        }

        .share-link-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom:10px;
        }

        .copy-btn {
          padding: 6px 15px;
          background-color: #f97316;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .tutorial-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 0;
          align-content: center;
          margin-top: 100px;
          margin-bottom: 30px;
          border-bottom: 1px solid #e0e0e0;
        }
        .product-tour{
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-content:center;
          align-items;center;
        }
        .capture-timestamp {
          font-size: 24px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .tutorial-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        @media (max-width: 768px) {
          .tutorial-body {
            grid-template-columns: 1fr;
          }
        }

        .screenshot-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .screenshot-frame {
          width: 100%;
          height: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .tutorial-screenshot {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 8px;
        }

        .instruction-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .instruction-content {
          margin-bottom: 20px;
        }

        .instruction-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 16px;
        }

        .instruction-description {
          font-size: 18px;
          line-height: 1.6;
          color: #555;
        }

        .navigation-wrapper {
          display: flex;
          justify-content: center;
          margin: 30px 0;
        }

        .step-navigator {
          display: flex;
          align-items: center;
          gap: 16px;
          background-color: white;
          border-radius: 50px;
          padding: 8px 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #f97316;
        }

        .prev-button, .next-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #f97316;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .prev-button:hover:not(:disabled),
        .next-button:hover:not(:disabled) {
          background-color: #fff0e6;
        }

        .prev-button:disabled,
        .next-button:disabled {
          color: #ccc;
          cursor: not-allowed;
        }

        .step-counter {
          font-size: 16px;
          font-weight: 600;
          color: #f97316;
          padding: 0 16px;
        }

        .tutorial-footer {
          display: flex;
          justify-content: space-between;
          padding: 20px 0;
          border-top: 1px solid #e0e0e0;
        }

        .edit-button, .share-button {
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
        }

        .edit-button {
          background-color: #1a202c;
          color: white;
          border: none;
        }

        .share-button {
          background-color: #f97316;
          color: white;
          border: none;
        }
      `}</style>
    </div>
  );
}

export default ProductTourPage;