import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../styles/groupsTab.css';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';

const FacultyGroupTab = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groups, setGroups] = useState([]); 
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [tempGroups, setTempGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [availableGroupNumbers, setAvailableGroupNumbers] = useState([]);

  useEffect(() => {
    const fetchGroupsAndStudents = async () => {
      try {
        const studentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/students`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const groupsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/courses/${courseId}/groups`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setStudents(studentsResponse.data);  
        const sortedGroups = groupsResponse.data.groups.sort((a, b) => a.groupNumber - b.groupNumber);
        setGroups(sortedGroups);  

        if (sortedGroups.length > 0) {
          const groupNumbers = sortedGroups.map(group => group.groupNumber);
          const maxGroupNumber = Math.max(...groupNumbers);
          const availableNumbers = Array.from({ length: maxGroupNumber }, (_, i) => i + 1).filter(num => !groupNumbers.includes(num));
          setAvailableGroupNumbers(availableNumbers);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchGroupsAndStudents();
  }, [courseId]);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    console.log('Selected group:', group);
  };

  const handleSelectStudent = (student) => {
    if (!selectedGroup) {
      alert("Please select a group first.");
      return;
    }

    setTempGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupNumber === selectedGroup.groupNumber) {
          const updatedMembers = group.members.some(m => m._id === student._id)
            ? group.members.filter(m => m._id !== student._id)
            : [...group.members, student];
          return { ...group, members: updatedMembers };
        }
        return group;
      });
    });

    setSelectedGroup(prevGroup => {
      if (!prevGroup) return null;
      const updatedMembers = prevGroup.members.some(m => m._id === student._id)
        ? prevGroup.members.filter(m => m._id !== student._id)
        : [...prevGroup.members, student];
      return { ...prevGroup, members: updatedMembers };
    });
  };

  const handleRemoveStudent = (student) => {
    setTempGroups(prevGroups => {
      return prevGroups.map(group => {
        if (group.groupNumber === selectedGroup.groupNumber) {
          const updatedMembers = group.members.filter(m => m._id !== student._id);
          return { ...group, members: updatedMembers };
        }
        return group;
      });
    });

    setSelectedGroup(prevGroup => {
      if (!prevGroup) return null;
      const updatedMembers = prevGroup.members.filter(m => m._id !== student._id);
      return { ...prevGroup, members: updatedMembers };
    });
  };

  const handleCreateGroup = () => {
    setEditingGroup(null); 
    setSelectedStudents([]);
    setTempGroups([]);
    setShowCreateModal(true);
  };

  const handleAddGroup = () => {
    const newGroupNumber = availableGroupNumbers.length > 0 ? availableGroupNumbers[0] : (groups.length + tempGroups.length + 1);
    const newGroup = {
      groupNumber: newGroupNumber,
      members: []
    };
    setTempGroups([...tempGroups, newGroup]);
    setAvailableGroupNumbers(availableGroupNumbers.filter(num => num !== newGroupNumber));
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);  
    setSelectedStudents(group.members);  
    setSelectedGroup(group);
    setTempGroups(groups.map(g => g._id === group._id ? group : g)); // 현재 그룹 상태를 tempGroups에 복사
    setShowEditModal(true); 
  };

  const handleDeleteGroup = (group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const confirmDeleteGroup = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/courses/${courseId}/groups/${groupToDelete._id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setGroups(groups.filter(group => group._id !== groupToDelete._id));
      setAvailableGroupNumbers([...availableGroupNumbers, groupToDelete.groupNumber]);
      setShowDeleteModal(false);
      alert('Group deleted successfully!');
    } catch (error) {
      console.error('Error deleting group:', error.response ? error.response.data : error.message);
      alert('Failed to delete group. Please try again.');
    }
  };

  const handleSaveGroup = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/saveGroups`, {
        groups: tempGroups // 새로운 그룹만 저장
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setGroups(response.data.groups);
        setSelectedStudents([]);
        setShowCreateModal(false);
        setShowEditModal(false);
        alert('Group saved successfully!');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error saving group:', error.response ? error.response.data : error.message);
      alert('Failed to save group. Please try again.');
    }
  };

  const getAvailableStudents = () => {
    const assignedStudentIds = groups.flatMap(group => group.members.map(member => member._id));
    return students.filter(student => !assignedStudentIds.includes(student._id));
  };

  const getStudentsForEdit = () => {
    if (!selectedGroup) return [];
    const assignedStudentIds = groups.flatMap(group => group.members.map(member => member._id));
    return students.filter(student => !assignedStudentIds.includes(student._id));
  };

  return (
    <div className="groups-tab">
      <Button variant="primary" onClick={handleCreateGroup} className="create-group-button">
        Create Group
      </Button>

      <div className="groups-grid">
        {groups.map((group, index) => (
          <div key={index} className="group-card" onClick={() => handleEditGroup(group)}>
            <div className="group-card-header">
              <h4>Group {group.groupNumber}</h4>
              <FaEdit className="edit-icon" onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }} />
              <FaTrash className="delete-icon text-danger" onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group); }} />
            </div>
            <ul>
              {group.members.map((member) => (
                <li key={member._id}>{member.name} ({member.email})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <CreateGroupModal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        handleAddGroup={handleAddGroup}
        tempGroups={tempGroups}
        selectedGroup={selectedGroup}
        handleSelectGroup={handleSelectGroup}
        getAvailableStudents={getAvailableStudents}
        handleSelectStudent={handleSelectStudent}
        handleSaveGroup={handleSaveGroup}
      />

      <EditGroupModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        editingGroup={editingGroup}
        selectedGroup={selectedGroup}
        handleSelectGroup={handleSelectGroup}
        getStudentsForEdit={getStudentsForEdit}
        handleSelectStudent={handleSelectStudent}
        handleSaveGroup={handleSaveGroup}
        handleRemoveStudent={handleRemoveStudent}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this group?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteGroup}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacultyGroupTab;