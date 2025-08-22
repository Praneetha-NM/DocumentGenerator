import React, { useState,useEffect } from 'react';
import { FaSearch, FaBell, FaChevronDown, FaPlus, FaPen, FaChevronLeft,FaChevronRight,FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import gmailScreenshot from '../assets/gmail_screenshot.png'
import './styles/WorkflowInterface.css';   // ✅ import CSS file
const WorkflowCapture = () => {

  const [editingStepId, setEditingStepId] = useState(null);
  const [activeTab, setActiveTab] = useState("Documentation"); // default
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false);
  const [screenshotInput, setScreenshotInput] = useState("");

      // Add new state at the top
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const handleAddStep = (position) => {
    const newStep = {
      id: steps.length + 1,   // temporary, reindexed below
      description: "New Step"
    };

    const updatedSteps = [...steps];

    if (position === "before") {
      updatedSteps.splice(currentStepIndex, 0, newStep);
    } else {
      updatedSteps.splice(currentStepIndex + 1, 0, newStep);
      setCurrentStepIndex(currentStepIndex + 1);
      
    }

    // Reassign IDs sequentially after insertion
    updatedSteps.forEach((step, idx) => {
      step.id = idx + 1;
    });

    setSteps(updatedSteps);
    setShowDropdown(false); // close dropdown
    
  };


  const goToPrevStep = () => {
    // Save current edits
    setSteps(prevSteps =>
      prevSteps.map((s, idx) =>
        idx === currentStepIndex ? { ...s, description: tourTitle, extra: tourExtra } : s
      )
    );
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };
    
  // Add this function inside your component
  const deleteScreenshot = (index) => {
    const updatedSteps = steps.map((step, idx) =>
      idx === index ? { ...step, screenshot: "" } : step
    );
    setSteps(updatedSteps);
  };

  const goToNextStep = () => {
    setSteps(prevSteps =>
      prevSteps.map((s, idx) =>
        idx === currentStepIndex ? { ...s, description: tourTitle, extra: tourExtra } : s
      )
    );
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

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
  const [tourTitle, setTourTitle] = useState(steps[currentStepIndex]?.description || "");
  const [tourExtra, setTourExtra] = useState(steps[currentStepIndex]?.extra || "");
  useEffect(() => {
    setTourTitle(steps[currentStepIndex]?.description || "");
    setTourExtra(steps[currentStepIndex]?.extra || "");
  }, [currentStepIndex, steps]);

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
  
    // ✅ Fix: Clamp currentStepIndex if out of bounds
    setCurrentStepIndex((prevIndex) => {
      if (prevIndex >= reindexedSteps.length) {
        return Math.max(reindexedSteps.length - 1, 0);
      }
      return prevIndex;
    });
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
        {/* Header with Tabs */}
        <div className="tab-switcher">
            <div className={`tab-slider ${activeTab === "Product Tour" ? "right" : "left"}`} />
            <button 
              className={`tab-btn ${activeTab === "Documentation" ? "active" : ""}`}
              onClick={() => setActiveTab("Documentation")}
            >
              Documentation
            </button>
            <button 
              className={`tab-btn ${activeTab === "Product Tour" ? "active" : ""}`}
              onClick={() => setActiveTab("Product Tour")}
            >
              Product Tour
            </button>
          </div>
    
      </div>
      {activeTab === "Documentation" ? (
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
      )
      :
      (
      <>
      {showScreenshotDialog && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Add Screenshot</h3>

      {/* URL Input */}
      <input
        type="text"
        placeholder="Enter image URL"
        value={screenshotInput}
        onChange={(e) => setScreenshotInput(e.target.value)}
        className="modal-input"
      />

      {/* File Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setScreenshotInput(reader.result);
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Actions */}
      <div className="modal-actions">
        <button 
          className="btn btn-primary"
          onClick={() => {
            const updatedSteps = steps.map((step, idx) =>
              idx === currentStepIndex ? { ...step, screenshot: screenshotInput } : step
            );
            setSteps(updatedSteps);
            setScreenshotInput("");
            setShowScreenshotDialog(false);
          }}
        >
          Confirm
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => {
            setScreenshotInput("");
            setShowScreenshotDialog(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <div className="action-header">
        <button className="btn btn-outline">Export</button>
        <button className="btn btn-primary">Deploy</button>
      </div>
    
      <div className="content-body">
        {/* Left side - Step Preview */}
        {/* Left side - Step Preview */}
<div className="left-panel">

  {steps[currentStepIndex]?.screenshot ? (
    <>
      
    <div className="screenshot-box relative">
    

      {/* Blinking circle if coordinates exist */}
      {steps[currentStepIndex].circleX && steps[currentStepIndex].circleY && (
        <div
          className="outer-circle"
          style={{
            top: steps[currentStepIndex].circleY || "26%",
            left: steps[currentStepIndex].circleX || "12%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <div className="inner-circle"></div>
        </div>
      )}

      <img
        src={steps[currentStepIndex].screenshot}
        alt={`Step ${steps[currentStepIndex].id} screenshot`}
        className="screenshot-img"
      />
      <div className="screenshot-actions">
        <button
          className="delete-btn"
          onClick={() => deleteScreenshot(currentStepIndex)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
    </>
    
  ) : (
    <div className="screenshot-placeholder">
      <button className="add-screenshot-btn" onClick={() => setShowScreenshotDialog(true)}>+</button>
    </div>
  )}
  
  {/* Step Navigation */}
  <div className="step-navigation">
    <button className="nav-btn" onClick={goToPrevStep} disabled={currentStepIndex === 0}>
      <FaChevronLeft />
    </button>
    <span className="step-counter">
      Step {currentStepIndex + 1} of {steps.length}
    </span>
    <button
      className="nav-btn"
      onClick={goToNextStep}
      disabled={currentStepIndex === steps.length - 1}
    >
      <FaChevronRight />
    </button>
  </div>
</div>

    
        {/* Right side form fields */}
        <div className="right-panel">
          <div className="input-box">
          <input 
      type="text" 
      placeholder="Sample Title"
      value={tourTitle}
      onChange={(e) => setTourTitle(e.target.value)}
    />
          </div>
    
          <div className="textarea-box">
          <textarea 
      placeholder="Add a description (optional)"
      value={tourExtra}
      onChange={(e) => setTourExtra(e.target.value)}
    />
          </div>
    
          <div className="form-actions">
  <div className="dropdown">
    <button className="btn btn-dark" onClick={() => setShowDropdown(!showDropdown)}>
      <FaPlus style={{ verticalAlign: 'middle', marginTop: '0px', fontSize: "10px" }} /> 
      <span> Add Step </span>  
      <FaChevronDown style={{ verticalAlign: 'middle', marginTop: '1px' }} />
    </button>

    {showDropdown && (
      <div className="dropdown-menu">
        <button onClick={() => handleAddStep("before")} className="dropdown-item">Add Before this Step</button>
        <button onClick={() => handleAddStep("after")} className="dropdown-item">Add After this Step</button>
      </div>
    )}
  </div>
  <button className="btn btn-danger" onClick={() => deleteStep(currentStepIndex)}>Delete Step</button>
</div>

        </div>
      </div>
    </>
    
      )}
      </div>
      
  </div>
  );
};

export default WorkflowCapture;