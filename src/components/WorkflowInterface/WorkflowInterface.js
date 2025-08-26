"use client"

import { useState, useRef, useEffect } from "react"
import {
  FaSearch,
  FaChevronDown,
  FaPlus,
  FaPen,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaSave,
  FaTimes,
  FaFolder,
  FaFileAlt,
  FaRegFolder,
  FaRegFile,
  FaTimesCircle,
  FaPlusCircle, 
} from "react-icons/fa";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import "./styles/WorkflowInterface.css";
import gmailScreenshot from '../assets/gmail_screenshot.png';

const WorkflowCapture = () => {
  const [editingStepId, setEditingStepId] = useState(null)
  const [activeTab, setActiveTab] = useState("Documentation")
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false)
  const [screenshotInput, setScreenshotInput] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const imgRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [editValues, setEditValues] = useState({
    description: "",
    extra: "",
    screenshot: "",
    circleX: "50%",
    circleY: "50%"
  })

  const handleDrag = (e) => {
    if (!dragging || !imgRef.current) return

    const rect = imgRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setEditValues({ ...editValues, circleX: x, circleY: y })
  }

  const spaces = [{ id: 1, name: "Main", icon: <FaRegFolder className="search-icon" /> }]

  const capturedWorkflows = [
    { id: 1, name: "Capture 2025-08-20 → T19:00", icon: <FaRegFile className="active-icon" />, active: true },
    { id: 2, name: "Untitled", icon: <FaRegFile /> },
  ]

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }
 
  // Collapse sidebar when screen width <= 1024px (tablet breakpoint)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Run once on mount
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)

  const [steps, setSteps] = useState([
    {
      id: 1,
      description: "Click On Gmail",
    },
    {
      id: 2,
      description: "Click on highlighted element",
      screenshot: gmailScreenshot,
      circleX: "12%",
      circleY: "26%",
    },
    {
      id: 3,
      description: "Click on the Button",
      extra:
        "This action will navigate to the Gmail login page where you can access your email account. The system will automatically detect and highlight interactive elements for the next step in the workflow.",
      screenshot: gmailScreenshot,
      circleX: "50%",
      circleY: "40%",
    },
  ])

  const handleAddStep = (position) => {
    const newStep = {
      id: steps.length + 1,
      description: "New Step",
    }

    const updatedSteps = [...steps]

    if (position === "before") {
      updatedSteps.splice(currentStepIndex, 0, newStep)
    } else {
      updatedSteps.splice(currentStepIndex + 1, 0, newStep)
      setCurrentStepIndex(currentStepIndex + 1)
    }

    updatedSteps.forEach((step, idx) => {
      step.id = idx + 1
    })

    setSteps(updatedSteps)
    setShowDropdown(false)
  }

  const goToPrevStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((s, idx) => (idx === currentStepIndex ? { ...s, description: tourTitle, extra: tourExtra } : s)),
    )
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const deleteScreenshot = (index) => {
    const updatedSteps = steps.map((step, idx) => (idx === index ? { ...step, screenshot: "" } : step))
    setSteps(updatedSteps)
  }

  const goToNextStep = () => {
    setSteps((prevSteps) =>
      prevSteps.map((s, idx) => (idx === currentStepIndex ? { ...s, description: tourTitle, extra: tourExtra } : s)),
    )
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const startEditing = (step) => {
    setEditingStepId(step.id)
    setEditValues({
      description: step.description || "",
      extra: step.extra || "",
      screenshot: step.screenshot || "",
      circleX: step.circleX || "50%",
      circleY: step.circleY || "50%"
    })
  }

  const [isEditing, setIsEditing] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const [editDescription, setEditDescription] = useState("")

  const handleEdit = (step) => {
    setCurrentStep(step)
    setEditDescription(step.description)
    setIsEditing(true)
  }

  const handleSave = () => {
    setSteps(steps.map((s) => (s.id === currentStep.id ? { ...s, description: editDescription } : s)))
    setIsEditing(false)
    setCurrentStep(null)
    setEditDescription("")
  }

  const [tourTitle, setTourTitle] = useState(steps[currentStepIndex]?.description || "")
  const [tourExtra, setTourExtra] = useState(steps[currentStepIndex]?.extra || "")

  useEffect(() => {
    setTourTitle(steps[currentStepIndex]?.description || "")
    setTourExtra(steps[currentStepIndex]?.extra || "")
  }, [currentStepIndex, steps])

  const addStepAt = (index) => {
    const newSteps = [...steps]

    newSteps.splice(index, 0, {
      id: 0,
      description: "New Step",
    })

    const reindexedSteps = newSteps.map((step, idx) => ({
      ...step,
      id: idx + 1,
    }))

    setSteps(reindexedSteps)
  }

  const deleteStep = (index) => {
    const newSteps = steps.filter((_, idx) => idx !== index)

    const reindexedSteps = newSteps.map((step, idx) => ({
      ...step,
      id: idx + 1,
    }))

    setSteps(reindexedSteps)

    setCurrentStepIndex((prevIndex) => {
      if (prevIndex >= reindexedSteps.length) {
        return Math.max(reindexedSteps.length - 1, 0)
      }
      return prevIndex
    })
  }
  const startDragging = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Identify whether it's a touch or mouse event
    const isTouch = e.type.includes('touch');
    
    // Get the initial click/touch position relative to the circle
    const circleElement = e.currentTarget;
    const circleRect = circleElement.getBoundingClientRect();
    
    // Calculate offset within the circle (where user clicked relative to the circle's top-left)
    let offsetX, offsetY, clientX, clientY;
    
    if (isTouch) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate the offset within the circle (where exactly the user clicked)
    offsetX = clientX - circleRect.left;
    offsetY = clientY - circleRect.top;
    
    // Function to handle movement
    const moveHandler = (moveEvent) => {
      if (isTouch) moveEvent.preventDefault();
      
      // Find the screenshot container
      const screenshotContainer = document.querySelector('.screenshot-container-edit');
      if (!screenshotContainer) return;
      
      const containerRect = screenshotContainer.getBoundingClientRect();
      
      // Get current pointer position
      let pointerX, pointerY;
      if (isTouch) {
        pointerX = moveEvent.touches[0].clientX;
        pointerY = moveEvent.touches[0].clientY;
      } else {
        pointerX = moveEvent.clientX;
        pointerY = moveEvent.clientY;
      }
      
      // Account for the offset within the circle to ensure it moves properly
      const adjustedX = pointerX - offsetX;
      const adjustedY = pointerY - offsetY;
      
      // Calculate position relative to container (the center of the circle)
      const relativeX = adjustedX - containerRect.left + (circleRect.width / 2);
      const relativeY = adjustedY - containerRect.top + (circleRect.height / 2);
      
      // Constrain within container boundaries
      const constrainedX = Math.min(Math.max(0, relativeX), containerRect.width);
      const constrainedY = Math.min(Math.max(0, relativeY), containerRect.height);
      
      // Convert to percentages for responsive positioning
      const percentX = (constrainedX / containerRect.width) * 100;
      const percentY = (constrainedY / containerRect.height) * 100;
      
      // Update state with the new position
      setEditValues(prev => ({
        ...prev,
        circleX: percentX + '%',
        circleY: percentY + '%'
      }));
    };
    
    // Function to clean up event listeners
    const endDragging = () => {
      if (isTouch) {
        document.removeEventListener('touchmove', moveHandler, { passive: false });
        document.removeEventListener('touchend', endDragging);
      } else {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', endDragging);
      }
    };
    
    // Add appropriate event listeners based on interaction type
    if (isTouch) {
      document.addEventListener('touchmove', moveHandler, { passive: false });
      document.addEventListener('touchend', endDragging);
    } else {
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', endDragging);
    }
  };
  // When a new screenshot is uploaded
const handleScreenshotUpload = (screenshotUrl) => {
  const updatedSteps = [...steps];
  updatedSteps[currentStepIndex] = {
    ...updatedSteps[currentStepIndex],
    screenshot: screenshotUrl,
    // Initialize circle at center of the image
    circleX: "50%",
    circleY: "50%"
  };
  setSteps(updatedSteps);
  setShowScreenshotDialog(false);
};
  const saveStep = () => {
    // Get the edit container to calculate proper percentages
    const editContainer = document.querySelector('.screenshot-container-edit');
    let circleX = editValues.circleX;
    let circleY = editValues.circleY;
    
    // If the values are in pixels, convert to percentages
    if (typeof circleX === 'number' || (typeof circleX === 'string' && !circleX.includes('%'))) {
      const containerWidth = editContainer?.offsetWidth || 100;
      circleX = ((parseFloat(circleX) / containerWidth) * 100) + '%';
    }
    
    if (typeof circleY === 'number' || (typeof circleY === 'string' && !circleY.includes('%'))) {
      const containerHeight = editContainer?.offsetHeight || 100;
      circleY = ((parseFloat(circleY) / containerHeight) * 100) + '%';
    }
    
    const updatedSteps = steps.map(step => 
      step.id === editingStepId ? {
        ...step,
        description: editValues.description,
        extra: editValues.extra,
        screenshot: editValues.screenshot,
        circleX: circleX,
        circleY: circleY
      } : step
    );
    
    setSteps(updatedSteps);
    setEditingStepId(null); // Close editing mode
  };

  // Cancel editing function
  const cancelEditing = () => {
    setEditingStepId(null); // Close editing mode without saving
  };
  // --- NEW --- Dedicated handler to delete the highlight
  const handleDeleteHighlight = () => {
    setEditValues(prevValues => ({
      ...prevValues,
      circleX: null,
      circleY: null,
    }));
  };
  // Handler to add a highlight at the center
  const handleAddHighlight = () => {
    setEditValues(prevValues => ({
      ...prevValues,
      circleX: '50%',
      circleY: '50%',
    }));
  };
  // --- NEW --- Handler to delete the highlight in the Product Tour view
  const deleteProductTourHighlight = () => {
    const updatedSteps = steps.map((step, index) => {
      if (index === currentStepIndex) {
        return { ...step, circleX: null, circleY: null };
      }
      return step;
    });
    setSteps(updatedSteps);
  };

  // --- NEW --- Handler to add a highlight in the Product Tour view
  const addProductTourHighlight = () => {
    const updatedSteps = steps.map((step, index) => {
      if (index === currentStepIndex) {
        return { ...step, circleX: '50%', circleY: '50%' };
      }
      return step;
    });
    setSteps(updatedSteps);
  };
  return (
    <div className="app">
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="user-avatar">
            <div className="avatar">J</div>
            {!isCollapsed && <span className="username">Jungroo</span>}
            {!isCollapsed && <FaChevronDown />}
          </div>
          <div className="notification" onClick={toggleSidebar}>
            {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20}/>}
          </div>
        </div>

        <div className="search-container">
          {!isCollapsed ? (
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search..." />
            </div>
          ) : (
            <FaSearch className="search-icon" />
          )}
        </div>

        <div className="sidebar-section">
          {!isCollapsed && <h3 className="sidebar-title">PERSONAL DOCS</h3>}
          <div className="sidebar-menu">
            <div className="folder">
              <FaFolder className="folder-icon" />
              {!isCollapsed && <span className="folder-label">Spaces</span>}
            </div>
            {spaces.map((space) => (
              <div key={space.id} className="menu-item">
                {space.icon}
                {!isCollapsed && <span className="menu-name">{space.name}</span>}
                {!isCollapsed && <FaChevronRight style={{ fontSize: "10px" }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          {!isCollapsed && <h3 className="sidebar-title">CHROME EXTENSION</h3>}
          <div className="sidebar-menu">
            <div className="folder">
              <FaFileAlt className="folder-icon" />
              {!isCollapsed && <span className="folder-label">Captured Workflows</span>}
            </div>
            {capturedWorkflows.map((workflow) => (
              <div key={workflow.id} className={`menu-item ${workflow.active ? "active" : ""}`}>
                {workflow.icon}
                {!isCollapsed && (
                  <span className={`menu-name ${workflow.active ? "active" : ""}`}>{workflow.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="main-content">
        {isCollapsed &&
          <div className="toggle-button" onClick={toggleSidebar}>
            <PanelLeftOpen size={20} />
          </div>
        }
        <div className={`content-holder ${isCollapsed ? "collapsed" : ""}`}>
        <div className="content-header" >
          <h2>Capture 2025-08-20 → T19:00</h2>
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
                <div className="separator">
                  <button className="add-step-btn" onClick={() => addStepAt(index)}>
                    <FaPlus />
                  </button>
                </div>

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
                            onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                          />

                          <textarea
                            value={editValues.extra}
                            placeholder="Step description (optional)"
                            className="edit-textarea"
                            onChange={(e) => setEditValues({ ...editValues, extra: e.target.value })}
                          />

                          <div className="media-container">
                            <div className="screenshot-container-edit">
                              {!editValues.screenshot ? (
                                <div className="no-screenshot-edit">No screenshot uploaded</div>
                              ) : (
                                <div className="screenshot-edit">
                                  <img
                                    src={editValues.screenshot}
                                    alt="Step screenshot"
                                    className="screenshot-img-edit"
                                  />
                                  {editValues.circleX && editValues.circleY && (
                                  <div
                                    className="outer-circle-edit"
                                    style={{
                                      top: editValues.circleY,
                                      left: editValues.circleX,
                                      transform: "translate(-50%, -50%)"
                                    }}
                                    onMouseDown={startDragging}
                                    onTouchStart={startDragging}
                                  >
                                    <div className="inner-circle"></div>
                                  </div>)}
                                  
                                  {/* --- FIX START --- */}
                                  {/* This button now correctly modifies the local editValues state */}
                                  <div className="screenshot-actions-edit">
  
  {/* This logic block handles the highlight add/delete toggle */}
  {editValues.circleX && editValues.circleY ? (
    // If highlight exists, show the DELETE button
    <button
      className="delete-btn"
      title="Delete Highlight"
      onClick={handleDeleteHighlight}
    >
      <FaTimesCircle />
    </button>
  ) : (
    // If highlight does NOT exist, show the ADD button
    <button
      className="delete-btn" // Reusing class for consistent styling
      title="Add Highlight"
      onClick={handleAddHighlight}
    >
      <FaPlusCircle />
    </button>
  )}

  {/* The "Delete Screenshot" button is always visible */}
  <button
    className="delete-btn"
    title="Delete Screenshot"
    onClick={() => setEditValues({ ...editValues, screenshot: "" })}
  >
    <FaTrash />
  </button>
</div>
                                </div>
                              )}
                            </div>

                            <div className="upload-container-edit">
                              <label className="file-upload-btn-edit">
                                Choose File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="file-input-edit"
                                  onChange={(e) => {
                                    const file = e.target.files[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onloadend = () => {
                                        setEditValues({
                                          ...editValues,
                                          screenshot: reader.result,
                                          circleX: editValues.circleX || step.circleX || '50%',
                                          circleY: editValues.circleY || step.circleY || '50%'
                                        })
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="form-actions-edit">
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
                  ) :(
                      <>
                        <div className="step-left">
                          <div className="number-title">
                            <div className="step-number">{step.id}</div>
                            {step.description && <p className="step-description">{step.description}</p>}
                          </div>
                          {step.extra && <p className="step-extra">{step.extra}</p>}
                        </div>

                        {step.screenshot && (
                          <div className="screenshot-container">
                            <div className="screenshot relative flex items-center justify-center">
                              <img
                                src={step.screenshot || "/placeholder.svg"}
                                alt={`Step ${step.id} screenshot`}
                                className="screenshot-img max-w-full max-h-full object-contain z-0"
                              />

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

                        <div className="step-actions">
                          <button className="edit-btn" onClick={() => startEditing(step)}>
                            <FaPen />
                          </button>
                          <button className="delete-btn" onClick={() => deleteStep(index)}>
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
              <button className="add-step-btn" onClick={() => addStepAt(steps.length)}>
                <FaPlus />
              </button>
            </div>
          </div>
        ) : (
          <div className="product-tour-container">
            {showScreenshotDialog && (
  <div className="modal-overlay">
    <div className="modal-box">
      <h3>Add Screenshot</h3>

      {/* This container will hold the upload button and the text prompt */}
      <div className="modal-upload-content">
        {/* The 'label' is styled as a button and triggers the file input */}
        <label htmlFor="screenshot-file-upload" className="btn btn-primary">
          Choose File
        </label>
        {/* The actual file input is hidden from view */}
        <input
          id="screenshot-file-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                // Store the selected image's data URL in state
                setScreenshotInput(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        {/* The centered text prompt below the button */}
        <p className="upload-prompt">
          {screenshotInput ? "Image selected!" : "Click here to upload an image"}
        </p>
      </div>

      <div className="modal-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            // Use the existing handler to update the step with the new screenshot
            handleScreenshotUpload(screenshotInput);
            // Reset the input state after confirming
            setScreenshotInput("");
          }}
          // The button is disabled until a file is selected
          disabled={!screenshotInput}
        >
          Confirm
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            // Also reset the input state on cancel
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
<div className="content-body">
  <div className="left-panel">
    {steps[currentStepIndex]?.screenshot ? (
      <div className="screenshot-box relative">
        {/* Only render circle if coordinates exist */}
        {steps[currentStepIndex].circleX && steps[currentStepIndex].circleY ? (
          <div
            className="outer-circle"
            style={{
              top: steps[currentStepIndex].circleY,
              left: steps[currentStepIndex].circleX,
              transform: "translate(-50%, -50%)",
              cursor: "move",
              position: "absolute",
              zIndex: 10
            }}
            onMouseDown={(e) => {
              // Prevent default to avoid text selection during drag
              e.preventDefault();
              
              // Get the screenshot container
              const container = e.target.closest('.screenshot-box');
              const rect = container.getBoundingClientRect();
              
              // Setup mouse move handler
              const handleMouseMove = (moveEvent) => {
                // Calculate position as percentage
                const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
                const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
                
                // Ensure we stay within bounds
                const boundedX = Math.max(0, Math.min(100, x));
                const boundedY = Math.max(0, Math.min(100, y));
                
                // Update step data
                const updatedSteps = [...steps];
                updatedSteps[currentStepIndex] = {
                  ...updatedSteps[currentStepIndex],
                  circleX: `${boundedX}%`,
                  circleY: `${boundedY}%`
                };
                setSteps(updatedSteps);
              };
              
              // Setup mouse up handler
              const handleMouseUp = () => {
                // Remove event listeners when done dragging
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              
              // Add event listeners
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div className="inner-circle"></div>
          </div>
        ) : null}

        <img
          src={steps[currentStepIndex].screenshot || "/placeholder.svg"}
          alt={`Step ${steps[currentStepIndex].id} screenshot`}
          className="screenshot-img"
          onClick={(e) => {
            // Add a circle when clicking on the image if there isn't one
            if (!steps[currentStepIndex].circleX || !steps[currentStepIndex].circleY) {
              const rect = e.target.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              
              const updatedSteps = [...steps];
              updatedSteps[currentStepIndex] = {
                ...updatedSteps[currentStepIndex],
                circleX: `${x}%`,
                circleY: `${y}%`
              };
              setSteps(updatedSteps);
            }
          }}
        />
        <div className="screenshot-actions">
          {/* Logic is now based on the current step's state */}
          {steps[currentStepIndex].circleX && steps[currentStepIndex].circleY ? (
            // If highlight exists, show the DELETE button
            <button
              className="delete-btn"
              title="Delete Highlight"
              onClick={deleteProductTourHighlight} // Use the new handler
            >
              <FaTimesCircle />
            </button>
          ) : (
            // If highlight does NOT exist, show the ADD button
            <button
              className="delete-btn"
              title="Add Highlight"
              onClick={addProductTourHighlight} // Use the new handler
            >
              <FaPlusCircle />
            </button>
          )}
          
          {/* This button was already correct */}
          <button 
            className="delete-btn" 
            title="Delete Screenshot"
            onClick={() => deleteScreenshot(currentStepIndex)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    ) : (
      <div className="screenshot-placeholder">
        <button className="add-screenshot-btn" onClick={() => setShowScreenshotDialog(true)}>
          +
        </button>
      </div>
    )}

    <div className="step-navigation">
      <button className="nav-btn" onClick={goToPrevStep} disabled={currentStepIndex === 0}>
        <FaChevronLeft />
      </button>
      <span className="step-counter">
        Step {currentStepIndex + 1} of {steps.length}
      </span>
      <button className="nav-btn" onClick={goToNextStep} disabled={currentStepIndex === steps.length - 1}>
        <FaChevronRight />
      </button>
    </div>
  </div>
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

  {/* Buttons will now sit centered below textarea */}
  <div className="form-actions">
    <div className="dropdown">
      <button className="btn btn-dark" onClick={() => setShowDropdown(!showDropdown)}>
        <FaPlus style={{ verticalAlign: "middle", fontSize: "10px" }} />
        <span> Add Step </span>
        <FaChevronDown style={{ verticalAlign: "middle", marginTop: "1px" }} />
      </button>

      {showDropdown && (
        <div className="dropdown-menu">
          <button onClick={() => handleAddStep("before")} className="dropdown-item">
            Add Before this Step
          </button>
          <button onClick={() => handleAddStep("after")} className="dropdown-item">
            Add After this Step
          </button>
        </div>
      )}
    </div>

    <button className="btn btn-danger" onClick={() => deleteStep(currentStepIndex)}>
      Delete Step
    </button>
  </div>
</div>

            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default WorkflowCapture;