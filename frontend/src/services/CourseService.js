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
        const response = await api.post(`${COURSE_API_URL}/`, courseJson);

        if (response.status !== 201) {
            console.error('Failed to create new course with error', response.statusText);

            throw new Error('Failed to create new course');
        }

        if(response.data) {
            return response.data;
        } else {
            console.error('Received OK status, but no course data when creating new course.');

            throw new Error('Failed to create new course');
        }
    },

    updateCourse: async (id, courseJson) => {
        const response = await api.put(`${COURSE_API_URL}/${courseJson._id}`, courseJson)

        if (response.status !== 204) {
            throw new Error('Failed to update course')
        }
    },

    deleteCourse: async (id) => {
        const response = await api.delete(`${COURSE_API_URL}/${id}`);

        if (response.status !== 200) {
            throw new Error('Failed to delete course');
        }
    }
}

export default CourseService;