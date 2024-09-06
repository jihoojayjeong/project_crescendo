import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';

const FacultyGroupTab = ({ onGroupSave }) => {
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
    setTempGroups(groups.map(g => g._id === group._id ? group : g));
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
      // Combine existing groups with temp groups
      const updatedGroups = [...groups, ...tempGroups].reduce((acc, group) => {
        const existingGroupIndex = acc.findIndex(g => g.groupNumber === group.groupNumber);
        if (existingGroupIndex !== -1) {
          // Update existing group
          acc[existingGroupIndex] = group;
        } else {
          // Add new group
          acc.push(group);
        }
        return acc;
      }, []);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/saveGroups`, {
        groups: updatedGroups
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setGroups(response.data.groups);
        setSelectedStudents([]);
        setTempGroups([]);
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
    <div className="p-6 bg-gray-100">
      <button 
        onClick={handleCreateGroup} 
        className="mb-6 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
      >
        <FaPlus className="inline mr-2" /> Create Group
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">Group {group.groupNumber}</h4>
              <div>
                <button onClick={(e) => { e.stopPropagation(); handleEditGroup(group); }} className="text-indigo-600 hover:text-indigo-800 mr-2">
                  <FaEdit />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group); }} className="text-red-600 hover:text-red-800">
                  <FaTrash />
                </button>
              </div>
            </div>
            <ul className="px-4 py-3">
              {group.members.map((member) => (
                <li key={member._id} className="text-sm text-gray-600 mb-1">
                  {member.name} <span className="text-gray-400">({member.email})</span>
                </li>
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
          <button 
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button 
            onClick={confirmDeleteGroup}
            className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacultyGroupTab;