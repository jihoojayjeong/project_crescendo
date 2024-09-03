import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const CreateGroupModal = ({ show, onHide, handleAddGroup, tempGroups, selectedGroup, handleSelectGroup, getAvailableStudents, handleSelectStudent, handleSaveGroup }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="group-add-text">Select group below before adding students</p>
        <Button 
          variant="secondary" 
          onClick={handleAddGroup}
          className="mt-2"
        >
          + Add Group
        </Button>
        <div className="temp-groups mt-3">
          {tempGroups.map((group, index) => (
            <div key={index} className="d-flex align-items-center">
              <Button
                variant={selectedGroup && selectedGroup.groupNumber === group.groupNumber ? "primary" : "outline-primary"}
                className="m-1"
                onClick={() => handleSelectGroup(group)}
              >
                Group {group.groupNumber}
              </Button>
            </div>
          ))}
        </div>
        <div className="students-list mt-3">
          {getAvailableStudents().map((student) => (
            <div key={student._id} className="student-item">
              <input
                type="checkbox"
                checked={selectedGroup?.members.some(m => m._id === student._id)}
                onChange={() => handleSelectStudent(student)}
              />
              <span>{student.name} ({student.email})</span>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSaveGroup}>
          Save Group
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateGroupModal;