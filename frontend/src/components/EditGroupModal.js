import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const EditGroupModal = ({ show, onHide, editingGroup, selectedGroup, handleSelectGroup, getStudentsForEdit, handleSelectStudent, handleSaveGroup, handleRemoveStudent }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);

  const confirmRemoveStudent = (student) => {
    setStudentToRemove(student);
    setShowDeleteConfirm(true);
  };

  const handleConfirmRemove = () => {
    handleRemoveStudent(studentToRemove);
    setShowDeleteConfirm(false);
    setStudentToRemove(null);
  };

  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group {editingGroup?.groupNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="temp-groups mt-3">
            <Button
              variant={selectedGroup && selectedGroup.groupNumber === editingGroup?.groupNumber ? "primary" : "outline-primary"}
              className="m-1"
              onClick={() => handleSelectGroup(editingGroup)}
            >
              Group {editingGroup?.groupNumber}
            </Button>
          </div>
          <div className="students-list mt-3">
            {selectedGroup?.members.map((student) => (
              <div key={student._id} className="student-item d-flex align-items-center">
                <span>{student.name} ({student.email})</span>
                <FaTrash className="text-danger ml-auto" onClick={() => confirmRemoveStudent(student)} />
              </div>
            ))}
          </div>
          <div className="students-list mt-3">
            {getStudentsForEdit().map((student) => (
              <div key={student._id} className="student-item">
                <input
                  type="checkbox"
                  checked={selectedGroup?.members?.some(m => m._id === student._id) || false}
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

      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this student from this group?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmRemove}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditGroupModal;