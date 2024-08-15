import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import '../styles/groupsTab.css';

const FacultyGroupTab = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [groups, setGroups] = useState([]); 
  const [showModal, setShowModal] = useState(false); 
  const [nextGroupNumber, setNextGroupNumber] = useState(1);
  const [editingGroup, setEditingGroup] = useState(null);

  useEffect(() => {
    const fetchGroupsAndStudents = async () => {
      try {
        const studentsResponse = await axios.get(`https://crescendo.cs.vt.edu:8080/courses/${courseId}/students`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const groupsResponse = await axios.get(`https://crescendo.cs.vt.edu:8080/courses/${courseId}/groups`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setStudents(studentsResponse.data);  
        setGroups(groupsResponse.data.groups);  

        if (groupsResponse.data.groups.length > 0) {
          const lastGroupNumber = Math.max(...groupsResponse.data.groups.map(group => group.groupNumber));
          setNextGroupNumber(lastGroupNumber + 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchGroupsAndStudents();
  }, [courseId]);

  const handleSelectStudent = (student) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(student)) {
        return prevSelected.filter((s) => s._id !== student._id);
      } else {
        return [...prevSelected, student];
      }
    });
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);  // 새로운 그룹 생성 시 편집 그룹 초기화
    setSelectedStudents([]);
    setShowModal(true);  // 모달 표시
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);  // 편집할 그룹 설정
    setSelectedStudents(group.members);  // 그룹 멤버 선택
    setShowModal(true);  // 모달 표시
  };

  const handleSaveGroup = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to form a group.");
      return;
    }

    let updatedGroups;
    if (editingGroup) {
      // 그룹 수정
      updatedGroups = groups.map((group) =>
        group.groupNumber === editingGroup.groupNumber
          ? { ...group, members: selectedStudents }
          : group
      );
    } else {
      // 새로운 그룹 생성
      const newGroup = {
        groupNumber: nextGroupNumber,
        members: selectedStudents
      };
      updatedGroups = [...groups, newGroup];
      setNextGroupNumber(nextGroupNumber + 1);  // 다음 그룹 번호 증가
    }

    setGroups(updatedGroups);
    setSelectedStudents([]);
    setShowModal(false);  // 모달 닫기

    // 서버에 저장
    try {
      const response = await axios.post(`https://crescendo.cs.vt.edu:8080/courses/${courseId}/saveGroups`, 
      { groups: updatedGroups },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Group saved successfully!');
    } catch (error) {
      console.error('Error saving group:', error);
      alert('Failed to save group. Please try again.');
    }
  };

  return (
    <div className="groups-tab">
      <Button variant="primary" onClick={handleCreateGroup} className="create-group-button">
        Create Group
      </Button>

      <h3>Generated Groups</h3>
      <div className="groups-grid">
        {groups.map((group, index) => (
          <div key={index} className="group-card">
            <div className="group-card-header">
              <h4>Group {group.groupNumber}</h4>
              <FaEdit className="edit-icon" onClick={() => handleEditGroup(group)} />
            </div>
            <ul>
              {group.members.map((member) => (
                <li key={member._id}>{member.name} ({member.email})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingGroup ? `Edit Group ${editingGroup.groupNumber}` : `Create Group ${nextGroupNumber}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="students-list">
            {students.map((student) => (
              <div key={student._id} className="student-item">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student)}
                  onChange={() => handleSelectStudent(student)}
                />
                <span>{student.name} ({student.email})</span>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveGroup}>
            Save Group
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacultyGroupTab;
