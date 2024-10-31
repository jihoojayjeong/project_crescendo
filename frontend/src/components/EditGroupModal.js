// import React, { useState } from 'react';
// import { FaTrash, FaUserPlus } from 'react-icons/fa';

// const EditGroupModal = ({ show, onHide, editingGroup, selectedGroup, handleSelectGroup, getStudentsForEdit, handleSelectStudent, handleSaveGroup, handleRemoveStudent }) => {
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [studentToRemove, setStudentToRemove] = useState(null);
//   const [groupName, setGroupName] = useState('');

//   useEffect(() => {
//     if (editingGroup) {
//       setGroupName(editingGroup.name || `Group ${editingGroup.groupNumber}`); // Set initial group name
//     }
//   }, [editingGroup]);

//   const confirmRemoveStudent = (student) => {
//     setStudentToRemove(student);
//     setShowDeleteConfirm(true);
//   };

//   const handleConfirmRemove = () => {
//     handleRemoveStudent(studentToRemove);
//     setShowDeleteConfirm(false);
//     setStudentToRemove(null);
//   };

//   const handleChangeGroupName = (e) => {
//     setGroupName(e.target.value); // Update group name state
//   };

//   const handleSave = () => {
//     if (editingGroup) {
//       const updatedGroup = {
//         ...editingGroup,
//         name: groupName  // Include updated group name in the group object
//       };
//       handleSaveGroup(updatedGroup); // Pass the updated group to handleSaveGroup
//     }
//     onHide(); // Close modal after saving
//   };

//   if (!show) return null;

//   return (
//     <>
//       <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onHide}>
//         <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-2xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
//           <div className="mt-3">
//             <h3 className="text-xl leading-6 font-medium text-gray-900 text-center mb-4">Edit Group {editingGroup?.groupNumber}</h3>
//             <div className="mt-2 px-4 py-3">
//               <div className="mb-6 text-center">
//                 <button
//                   className={`px-6 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
//                     selectedGroup && selectedGroup.groupNumber === editingGroup?.groupNumber
//                       ? 'bg-indigo-600 text-white'
//                       : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                   }`}
//                   onClick={() => handleSelectGroup(editingGroup)}
//                 >
//                   Group {editingGroup?.groupNumber}
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
//                   <h4 className="text-lg font-semibold mb-3 text-gray-700">Group Members</h4>
//                   {selectedGroup?.members.map((student) => (
//                     <div key={student._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//                       <span className="text-gray-800">{student.name} <span className="text-gray-500 text-sm">({student.email})</span></span>
//                       <button
//                         onClick={() => confirmRemoveStudent(student)}
//                         className="px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out text-sm w-24"
//                       >
//                         <FaTrash className="inline mr-1" /> Remove
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
//                   <h4 className="text-lg font-semibold mb-3 text-gray-700">Available Students</h4>
//                   {getStudentsForEdit().map((student) => (
//                     <div key={student._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
//                       <span className="text-gray-800">{student.name} <span className="text-gray-500 text-sm">({student.email})</span></span>
//                       <button
//                         onClick={() => handleSelectStudent(student)}
//                         className={`px-1 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out w-24 ${
//                           selectedGroup?.members.some(m => m._id === student._id)
//                             ? 'bg-red-500 text-white hover:bg-red-600'
//                             : 'bg-green-500 text-white hover:bg-green-600'
//                         }`}
//                       >
//                         {selectedGroup?.members.some(m => m._id === student._id) ? (
//                           <><FaTrash className="inline mr-1" /> Remove</>
//                         ) : (
//                           <><FaUserPlus className="inline mr-1" /> Add</>
//                         )}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6 text-center">
//               <button
//                 onClick={onHide}
//                 className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out mr-4"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveGroup}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
//               >
//                 Save Group
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//           <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//             <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Confirm Delete</h3>
//             <p className="text-sm text-gray-500">Are you sure you want to delete this student from this group?</p>
//             <div className="mt-4 text-center">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out mr-2"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmRemove}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default EditGroupModal;




// FROM AI
import React, { useState, useEffect } from 'react';
import { FaTrash, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditGroupModal = ({
  show,
  onHide,
  editingGroup,
  selectedGroup,
  handleSelectGroup,
  getStudentsForEdit,
  handleSelectStudent,
  handleSaveGroup,
  handleRemoveStudent,
  handleGroupName
}) => {
  const { courseId } = useParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [groupName, setGroupName] = useState('');

  useEffect(() => {
    if (editingGroup) {
      setGroupName(editingGroup.name || `Group ${editingGroup.groupNumber}`); // Set initial group name
    }
  }, [editingGroup]);

  const confirmRemoveStudent = (student) => {
    setStudentToRemove(student);
    setShowDeleteConfirm(true);
  };

  const handleConfirmRemove = () => {
    handleRemoveStudent(studentToRemove);
    setShowDeleteConfirm(false);
    setStudentToRemove(null);
  };

  const handleChangeGroupName = (e) => {
    setGroupName(e.target.value); // Update group name state
  };

  const handleSave = async () => {
    if (editingGroup) {
      const updatedGroup = {
        ...editingGroup,
        name: groupName  // Include updated group name in the group object
      };
      console.log("the updated group is:",updatedGroup);

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/courses/${courseId}/saveGroup`, {
        group: updatedGroup
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        handleGroupName(response.data.groups);
      } else {
        throw new Error('Invalid response from server');
      }
      //have an ajax
    }
    onHide(); // Close modal after saving
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onHide}>
        <div className="relative top-20 mx-auto p-5 border w-3/4 max-w-2xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="mt-3">
            <h3 className="text-xl leading-6 font-medium text-gray-900 text-center mb-4">
              Edit Group {editingGroup?.groupNumber}
            </h3>
            <div className="mt-2 px-4 py-3">
              {/* Group Name Input Field */}
              <div className="mb-6 text-center">
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={handleChangeGroupName}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Group Members</h4>
                  {selectedGroup?.members.map((student) => (
                    <div key={student._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-800">{student.name} <span className="text-gray-500 text-sm">({student.email})</span></span>
                      <button
                        onClick={() => confirmRemoveStudent(student)}
                        className="px-1 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-150 ease-in-out text-sm w-24"
                      >
                        <FaTrash className="inline mr-1" /> Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">Available Students</h4>
                  {getStudentsForEdit().map((student) => (
                    <div key={student._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-800">{student.name} <span className="text-gray-500 text-sm">({student.email})</span></span>
                      <button
                        onClick={() => handleSelectStudent(student)}
                        className={`px-1 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out w-24 ${
                          selectedGroup?.members.some(m => m._id === student._id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {selectedGroup?.members.some(m => m._id === student._id) ? (
                          <><FaTrash className="inline mr-1" /> Remove</>
                        ) : (
                          <><FaUserPlus className="inline mr-1" /> Add</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={onHide}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Save Group
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-500">Are you sure you want to delete this student from this group?</p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-150 ease-in-out mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 ease-in-out"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditGroupModal;
