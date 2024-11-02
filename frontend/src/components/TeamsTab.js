import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

const TeamsTab = ({ course, userGroup }) => {
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/courses/${course._id}/groups`,
        { withCredentials: true }
      );
      setGroups(response.data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    if (course) {
      fetchGroups();
      // 5초마다 그룹 정보 업데이트
      const intervalId = setInterval(fetchGroups, 5000);
      return () => clearInterval(intervalId);
    }
  }, [course]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div 
          key={group._id} 
          className={`bg-white rounded-lg shadow-md p-6 ${
            group.groupNumber.toString() === userGroup ? 'border-2 border-indigo-500' : ''
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {group.name || `Group ${group.groupNumber}`}
          </h3>
          <ul className="space-y-2">
            {group.members.map((member) => (
              <li key={member._id} className="flex items-center space-x-2">
                <FaUser className="text-gray-500" />
                <span>{member.name} ({member.email})</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamsTab;