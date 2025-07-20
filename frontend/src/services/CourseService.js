import api from './api';

const COURSE_API_URL = 'courses';

const CourseService = {
    // Fetch all courses
    getAllCourses: async () => {
        const response = await api.get(`${COURSE_API_URL}/`);

        if (response.status !== 200) {
            throw new Error('Failed to fetch courses');
        }

        if (response.data) {
            return response.data;
        } else {
            return [];
        }
    },

    getCourseById: async (id) => {
        const response = await api.get(`${COURSE_API_URL}/${id}`);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch course with ID ${id}`);
        }

        if (response.data) {
            return response.data;
        } else {
            throw new Error(`Course with ID ${id} not found`);
        }
    },

    createCourse: async (courseJson) => {

    },

    updateCourse: async (id, courseJson) => {
        console.log('will update course with id', id);
        const response = await api.put(`${COURSE_API_URL}/${courseJson._id}`, courseJson)

        if (response.status !== 204) {
            throw new Error('Failed to update course')
        }
    }
}

export default CourseService;