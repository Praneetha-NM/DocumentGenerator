import React from 'react';
import { IoBookOutline, IoClose } from "react-icons/io5";
import './styles/TableOfContents.css';

const TableOfContents = ({ 
    isTocVisible,
    setIsTocVisible, 
  steps, 
  currentStepIndex, 
  setCurrentStepIndex, 
}) => {
 
  const toggleToc = () => {
    setIsTocVisible(!isTocVisible);
  };

  const handleStepClick = (index) => {
    setCurrentStepIndex(index);
    document.getElementById(`step-${index}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  
  return (
    <div className={`toc-container ${isTocVisible ? "visible" : ""}`}>
      
      
      {isTocVisible && (
        <div className="toc-content">
          <div className="toc-header">
            <IoBookOutline className="toc-icon" />
            <span className="toc-title">TABLE OF CONTENTS</span>
          </div>
          <div className="toc-list">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`toc-item ${index === currentStepIndex ? 'active' : ''}`}
                onClick={() => handleStepClick(index)}
              >
                {step.description}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="toc-toggle-icon" onClick={toggleToc}>
        {!isTocVisible ? <IoBookOutline size={16} /> : <IoClose size={16} />}
      </div>
    </div>
  );
};

export default TableOfContents;
