import React from 'react';
import { Modal } from 'react-bootstrap';
import { FaPlus, FaUserPlus } from 'react-icons/fa';

const CreateGroupModal = ({ show, onHide, handleAddGroup, tempGroups, selectedGroup, handleSelectGroup, getAvailableStudents, handleSelectStudent, handleSaveGroup }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="font-sans">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <h3 className="text-2xl font-bold">Create Group</h3>
          <button onClick={onHide} className="text-white hover:text-gray-200 transition duration-150 ease-in-out">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">Select a group before adding students</p>
          <button 
            onClick={handleAddGroup}
            className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            <FaPlus className="inline mr-2" /> Add Group
          </button>
          <div className="flex flex-wrap gap-2 mb-6">
            {tempGroups.map((group, index) => (
              <button
                key={index}
                onClick={() => handleSelectGroup(group)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                  selectedGroup && selectedGroup.groupNumber === group.groupNumber
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                Group {group.groupNumber}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
            <h4 className="text-lg font-semibold mb-2 text-gray-700">Available Students</h4>
            {getAvailableStudents().map((student) => (
              <div key={student._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <span className="text-gray-800">{student.name} <span className="text-gray-500 text-sm">({student.email})</span></span>
                <button
                  onClick={() => handleSelectStudent(student)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                    selectedGroup?.members.some(m => m._id === student._id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {selectedGroup?.members.some(m => m._id === student._id) ? 'Remove' : <><FaUserPlus className="inline mr-1" /> Add</>}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 text-right">
          <button onClick={onHide} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out mr-2">
            Cancel
          </button>
          <button onClick={handleSaveGroup} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out">
            Save Group
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGroupModal;