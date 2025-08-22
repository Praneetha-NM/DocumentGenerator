import React, { useState } from 'react';
import { FaSearch, FaBell, FaChevronDown, FaPlus, FaPen, FaChevronRight,FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import gmailScreenshot from '../assets/gmail_screenshot.png'
import './styles/WorkflowInterface.css';   // ✅ import CSS file
const WorkflowCapture = () => {
    const [editingStepId, setEditingStepId] = useState(null);
const [editValues, setEditValues] = useState({
  description: "",
  extra: "",
  screenshot: ""
});

// Start editing a step
const startEditing = (step) => {
  setEditingStepId(step.id);
  setEditValues({
    description: step.description || "",
    extra: step.extra || "",
    screenshot: step.screenshot || ""
  });
};

// Save step updates
const saveStep = () => {
  const updatedSteps = steps.map((s) =>
    s.id === editingStepId
      ? { ...s, ...editValues } // merge edited values
      : s
  );
  setSteps(updatedSteps);
  setEditingStepId(null);
};

// Cancel editing
const cancelEditing = () => {
  setEditingStepId(null);
  setEditValues({ description: "", extra: "", screenshot: "" });
};

const [isEditing, setIsEditing] = useState(false);
const [currentStep, setCurrentStep] = useState(null);
const [editDescription, setEditDescription] = useState("");

// Open edit modal with existing values
const handleEdit = (step) => {
  setCurrentStep(step);
  setEditDescription(step.description); // ✅ pre-fill input with existing value
  setIsEditing(true);
};

// Save updated value
const handleSave = () => {
  setSteps(steps.map(s =>
    s.id === currentStep.id ? { ...s, description: editDescription } : s
  ));
  setIsEditing(false);
  setCurrentStep(null);
  setEditDescription("");
};

  const [steps, setSteps] = useState([
    {
      id: 1,
      description: "Click On Gmail"
    },
    {
      id: 2,
      description: "Click on highlighted element",
      screenshot: gmailScreenshot,
      circleX: "12%", // 👈 X coordinate
      circleY: "26%", // 👈 Y coordinate
    },
    {
        id:3,
        description:"Click on the Button",
        extra:'This action will navigate to the Gmail login page where you can access your email account. The system will automatically detect and highlight interactive elements for the next step in the workflow.',
        screenshot:gmailScreenshot,
        circleX: "50%",
        circleY: "40%",
    }
  ]);
  const addStepAt = (index) => {
    const newSteps = [...steps];
  
    // Insert new step ABOVE the given index
    newSteps.splice(index, 0, {
      id: 0, // temporary, will be re-assigned
      description: "New Step"
    });
  
    // Reassign step IDs sequentially
    const reindexedSteps = newSteps.map((step, idx) => ({
      ...step,
      id: idx + 1
    }));
  
    setSteps(reindexedSteps);
  };
  const deleteStep = (index) => {
    const newSteps = steps.filter((_, idx) => idx !== index);
  
    // Reassign IDs
    const reindexedSteps = newSteps.map((step, idx) => ({
      ...step,
      id: idx + 1
    }));
  
    setSteps(reindexedSteps);
  };
  
  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-avatar">
            <div className="avatar">S</div>
            <span className="username">Siraar</span>
            <FaChevronDown />
          </div>
          <div className="notification">
            <FaBell />
          </div>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
        </div>
        
        <div className="sidebar-section">
        <h3 className='sidebar-title'>PERSONAL DOCS</h3>
          <div className="sidebar-menu">
            <h4 className='with-dropdown'>Spaces</h4>
            <div className="menu-item">
              <span>Main</span>
              <FaChevronRight />
            </div>
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3 className='sidebar-title'>CHROME EXTENSION</h3>
          <div className="sidebar-menu">
            <h4 className="with-dropdown">Captured Workflows</h4>
            <div className="menu-item active">
              <span>Capture 2025-08-20 → T19:00</span>
            </div>
            <div className="menu-item">
              <span>Untitled</span>
            </div>
          </div>
        </div>
      </div>
      <div className="main-content">
      {/* Header */}
      <div className="content-header">
        <h2>Capture 2025-08-20 → T19:00</h2>
        <button className="more-options">...</button>
      </div>
      <div className="workflow-steps">
      {steps.map((step, index) => (
  <div key={step.id} className="step-wrapper">

    {/* Separator line with Add button (top) */}
    <div className="separator">
      <button 
        className="add-step-btn"
        onClick={() => addStepAt(index)} // 👈 insert ABOVE this step
      >
        <FaPlus />
      </button>
    </div>

    {/* Step Content */}
    <div className="step-container">
      <div className="step-row">
        
      {editingStepId === step.id ? (
  <div className="edit-form">
    <div className="edit-header">
      <div className="step-number">{step.id}</div>
      <div className="content">
        <input
          type="text"
          value={editValues.description}
          placeholder="Step title"
          className="edit-input"
          onChange={(e) =>
            setEditValues({ ...editValues, description: e.target.value })
          }
        />

        <textarea
          value={editValues.extra}
          placeholder="Step description (optional)"
          className="edit-textarea"
          onChange={(e) =>
            setEditValues({ ...editValues, extra: e.target.value })
          }
        />

<div className="screenshot-inputs">
  {/* URL Input */}
  <input
    type="text"
    value={editValues.screenshot}
    placeholder="Image URL (optional)"
    className="edit-input"
    onChange={(e) =>
      setEditValues({ ...editValues, screenshot: e.target.value })
    }
  />

  {/* Upload Button */}
  <input
    type="file"
    accept="image/*"
    className="file-input"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditValues({ ...editValues, screenshot: reader.result });
        };
        reader.readAsDataURL(file);
      }
    }}
  />
</div>


        <div className="form-actions">
          <button className="save-btn" onClick={saveStep}>
            <FaSave /> Save
          </button>
          <button className="cancel-btn" onClick={cancelEditing}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
) : (
          <>
            {/* Normal View Mode */}
            <div className="step-left">
              <div className="number-title">
                <div className="step-number">{step.id}</div>
                {step.description && <p className="step-description">{step.description}</p>}
              </div>
              {step.extra && <p className="step-extra">{step.extra}</p>}
            </div>

            {/* Screenshot */}
            {step.screenshot && (
              <div className="screenshot-container">
                <div className="screenshot relative flex items-center justify-center">
                  <img 
                    src={step.screenshot} 
                    alt={`Step ${step.id} screenshot`} 
                    className="screenshot-img max-w-full max-h-full object-contain z-0"
                  />

                  {/* Blinking circle if coordinates exist */}
                  {step.circleX && step.circleY && (
                    <div 
                      className="outer-circle"
                      style={{
                        top: step.circleY,
                        left: step.circleX,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      <div className="inner-circle"></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="step-actions">
              <button 
                className="edit-btn"
                onClick={() => startEditing(step)} 
              >
                <FaPen />
              </button>
              <button 
                className="delete-btn"
                onClick={() => deleteStep(index)}
              >
                <FaTrash />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
))}

<div className="separator">
<button 
    className="add-step-btn"
    onClick={() => addStepAt(steps.length)} // 👈 insert at end
  >
          <FaPlus />
        </button>
      </div>
      </div>
      </div>
      
  </div>
  );
};

export default WorkflowCapture;