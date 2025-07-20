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
        
    },

    createCourse: async (courseJson) => {
        
    },

    updateCourse: async (id, courseJson) => {

    }
}

export default CourseService;