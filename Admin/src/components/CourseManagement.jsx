// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
// import Modal from './Modal';

// const CourseManagement = () => {
//   const [courses, setCourses] = useState([]);
//   const [channels, setChannels] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalType, setModalType] = useState('add');
//   const [currentEditItem, setCurrentEditItem] = useState(null);
//   const [selectedChannels, setSelectedChannels] = useState([]);

//   const COURSE_API_URL = 'http://localhost:5000/api/courses';
//   const CHANNEL_API_URL = 'http://localhost:5000/api/channels';

//   // Fetch courses and channels
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [coursesRes, channelsRes] = await Promise.all([
//         axios.get(COURSE_API_URL),
//         axios.get(CHANNEL_API_URL)
//       ]);
//       setCourses(coursesRes.data);
//       setChannels(channelsRes.data);
//     } catch (err) {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleOpenModal = (type, item = null) => {
//     setModalType(type);
//     setCurrentEditItem(item);

//     if (item) {
//       setSelectedChannels(item.channels?.map(ch => ch._id) || []);
//     } else {
//       setSelectedChannels([]);
//     }

//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setCurrentEditItem(null);
//     setSelectedChannels([]);
//   };

//   const handleChannelChange = (e) => {
//     const options = Array.from(e.target.selectedOptions, option => option.value);
//     setSelectedChannels(options);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const form = e.target;
//     const courseData = {
//       name: form.name.value,
//       description: form.description.value,
//       imageUrl: form.imageUrl.value,
//       channels: selectedChannels
//     };

//     try {
//       if (modalType === 'add') {
//         await axios.post(COURSE_API_URL, courseData);
//       } else {
//         await axios.put(`${COURSE_API_URL}/${currentEditItem._id}`, courseData);
//       }
//       handleCloseModal();
//       fetchData();
//     } catch (err) {
//       setError(err.message || `Failed to ${modalType} course`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;
//     setLoading(true);
//     setError(null);
//     try {
//       await axios.delete(`${COURSE_API_URL}/${id}`);
//       fetchData();
//     } catch (err) {
//       setError(err.message || 'Failed to delete course');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p className="text-center text-gray-500">Loading...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => handleOpenModal('add')}
//           className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//         >
//           <FaPlus />
//           <span>Add New Course</span>
//         </button>
//       </div>

//       <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {courses.length > 0 ? (
//               courses.map(course => (
//                 <tr key={course._id}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{course.description}</td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {course.channels?.map(ch => ch.name).join(', ') || 'N/A'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                     <button
//                       onClick={() => handleOpenModal('edit', course)}
//                       className="text-blue-600 hover:text-blue-900"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(course._id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-4 text-gray-500">No courses found.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {modalOpen && (
//         <Modal title={`${modalType === 'add' ? 'Add' : 'Edit'} Course`} onClose={handleCloseModal}>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Course Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 defaultValue={currentEditItem?.name || ''}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Description</label>
//               <textarea
//                 name="description"
//                 defaultValue={currentEditItem?.description || ''}
//                 rows="3"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 required
//               ></textarea>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Image URL</label>
//               <input
//                 type="url"
//                 name="imageUrl"
//                 defaultValue={currentEditItem?.imageUrl || ''}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700">Select Channels</label>
//               <select
//                 multiple
//                 value={selectedChannels}
//                 onChange={handleChannelChange}
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
//               >
//                 {channels.map(ch => (
//                   <option key={ch._id} value={ch._id}>{ch.name}</option>
//                 ))}
//               </select>
//               <p className="text-gray-500 text-sm mt-1">Hold Ctrl (Cmd on Mac) to select multiple channels</p>
//             </div>

//             <div className="flex justify-end space-x-2 mt-4">
//               <button
//                 type="button"
//                 onClick={handleCloseModal}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 {modalType === 'add' ? 'Add' : 'Update'}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default CourseManagement;

// client/src/components/CourseManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Modal from "./Modal";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [channels, setChannels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [courseImageUrl, setCourseImageUrl] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch channels (corrected)
  // Fetch channels (corrected)
const fetchChannels = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/channels");
    console.log("Channels response:", response.data); // Debug log
    
    // Use response.data directly, not response.data.data
    setChannels(Array.isArray(response.data) ? response.data : []);
  } catch (error) {
    console.error("Error fetching channels:", error);
    setChannels([]); // Set empty array on error
  }
};

  // Fetch categories (corrected)
const fetchCategories = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/categories");
    console.log("Categories response:", response.data); // Debug log

    // ✅ Use response.data.data instead of response.data
    setCategories(Array.isArray(response.data.data) ? response.data.data : []);
  } catch (error) {
    console.error("Error fetching categories:", error);
    setCategories([]); // fallback
  }
};


  useEffect(() => {
    fetchCourses();
    fetchChannels();
    fetchCategories();
  }, []);

  // Open Modal
  const openModal = (course = null) => {
    setEditingCourse(course);
    if (course) {
      setCourseName(course.name);
      setCourseDescription(course.description);
      setCourseImageUrl(course.imageUrl || "");
      setSelectedCategory(course.categoryId?._id || "");
      // ✅ Add a safe check for `course.channels` before mapping
      setSelectedChannels(course.channels?.map((ch) => ch._id) || []);
    } else {
      setCourseName("");
      setCourseDescription("");
      setCourseImageUrl("");
      setSelectedCategory("");
      setSelectedChannels([]);
    }
    setModalOpen(true);
  };

  // Save Course
  const saveCourse = async () => {
    try {
      const courseData = {
        name: courseName,
        description: courseDescription,
        imageUrl: courseImageUrl,
        categoryId: selectedCategory,
        channels: selectedChannels,
      };

      if (editingCourse) {
        await axios.put(
          `http://localhost:5000/api/courses/${editingCourse._id}`,
          courseData
        );
      } else {
        await axios.post("http://localhost:5000/api/courses", courseData);
      }

      fetchCourses();
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Delete Course
  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Course Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          <FaPlus className="mr-2" /> Add Course
        </button>
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Category
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Channels
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id} className="border-t">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {course.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {course.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {course.categoryId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {/* ✅ The fix: Use optional chaining to safely access 'channels' */}
                  {course.channels?.map((ch) => ch.name).join(", ") || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => openModal(course)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-lg font-semibold mb-4">
            {editingCourse ? "Edit Course" : "Add Course"}
          </h3>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="Course Description"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            value={courseImageUrl}
            onChange={(e) => setCourseImageUrl(e.target.value)}
            placeholder="Course Image URL"
            className="w-full p-2 mb-2 border rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          >
            <option value="">Select a category...</option>
            {/* ✅ Add a safe check for the 'categories' array */}
            {Array.isArray(categories) && categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            multiple
            value={selectedChannels}
            onChange={(e) =>
              setSelectedChannels(
                [...e.target.selectedOptions].map((o) => o.value)
              )
            }
            className="w-full p-2 mb-4 border rounded"
          >
            {/* ✅ Add a safe check for the 'channels' array */}
            {Array.isArray(channels) && channels.map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.name}
              </option>
            ))}
          </select>
          <button
            onClick={saveCourse}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </Modal>
      )}
    </div>
  );
};

export default CourseManagement;