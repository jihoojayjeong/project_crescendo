import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CreateGroupModal from './CreateGroupModal';
import EditGroupModal from './EditGroupModal';
import ViewFeedbacksModal from './ViewFeedbacksModal';

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
  const [showFeedbacksModal, setShowFeedbacksModal] = useState(false);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState([]);
  const [feedbackModalType, setFeedbackModalType] = useState('');
  const [selectedGroupNumber, setSelectedGroupNumber] = useState(null);
  const [userGroup, setUserGroup] = useState(null);

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
        console.log("sorted groups fetched from backend:", sortedGroups);
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
      members: [],
      name:"",
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
      const updatedGroups = [...groups, ...tempGroups].reduce((acc, group) => {
        //console.log("Group in facultygroups compnent:", group);
        const existingGroupIndex = acc.findIndex(g => g.groupNumber === group.groupNumber);
        if (existingGroupIndex !== -1) {
          acc[existingGroupIndex] = group;
        } else {
          acc.push(group);
        }
        return acc;
      }, []);

      //console.log("updatedGroups",updatedGroup);

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
  
  const handleGroupName = (updatedGroups) => {
    const sortedGroups = updatedGroups.sort((a, b) => a.groupNumber - b.groupNumber);
    setGroups(sortedGroups);
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

  const handleViewFeedbacks = async (group, type) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/courses/${courseId}/feedbacks`,
        { withCredentials: true }
      );
      
      const filteredFeedbacks = type === 'received'
        ? response.data.filter(f => f.toGroup === group.groupNumber.toString())
        : response.data.filter(f => f.fromGroup === userGroup && f.toGroup === group.groupNumber.toString());
      
      setSelectedFeedbacks(filteredFeedbacks);
      setFeedbackModalType(type);
      setSelectedGroupNumber(group.groupNumber);
      setShowFeedbacksModal(true);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks');
    }
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
        {groups.map((group) => (
          <div key={group._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-lg font-semibold text-gray-800">
                {group.name || `Group ${group.groupNumber}`}
              </h4>
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
              {group.members.map((member, index) => (
                <li 
                  key={`${group._id}-member-${member._id || index}`} 
                  className="text-sm text-gray-600 mb-1"
                >
                  {member.name} <span className="text-gray-400">({member.email})</span>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 flex justify-end space-x-2">
              {group.groupNumber.toString() === userGroup && (
                <button
                  onClick={() => handleViewFeedbacks(group, 'received')}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  See feedbacks received
                </button>
              )}
            </div>
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
        handleGroupName = {handleGroupName}
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

      <ViewFeedbacksModal
        show={showFeedbacksModal}
        onHide={() => setShowFeedbacksModal(false)}
        feedbacks={selectedFeedbacks}
        type={feedbackModalType}
        groupNumber={selectedGroupNumber}
        courseId={courseId}
        onFeedbackUpdate={() => handleViewFeedbacks(
          { groupNumber: selectedGroupNumber },
          feedbackModalType
        )}
      />
    </div>
  );
};

export default FacultyGroupTab;