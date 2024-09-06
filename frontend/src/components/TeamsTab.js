import React from 'react';
import { FaUser } from 'react-icons/fa';

const TeamsTab = ({ course, userGroup }) => {
  const myTeam = course?.groups?.find(group => group.groupNumber.toString() === userGroup);

  if (!myTeam) {
    return <p>You are not assigned to any team.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">My Team (Group {userGroup})</h2>
      <ul className="space-y-2">
        {myTeam.members.map((member) => (
          <li key={member._id} className="flex items-center space-x-2">
            <FaUser className="text-gray-500" />
            <span>{member.name} ({member.email})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsTab;