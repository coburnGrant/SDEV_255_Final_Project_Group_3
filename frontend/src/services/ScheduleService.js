import api from "./api";

const SCHEDULE_API_URL = 'schedules';

const ScheduleService = {
    getSchedules: async (term, year) => {
        const params = {};

        if (year) {
            params.year = year;
        }

        if (term) {
            params.term = term;
        }

        const response = await api.get(`${SCHEDULE_API_URL}/`, { params });

        return response.data;
    },

    getScheduleById: async (id) => {
        const response = await api.get(`${SCHEDULE_API_URL}/${id}`);
        return response.data;
    },

    addSchedule: async ({ term, year }) => {
        const response = await api.post('/schedules', { term, year });
        return response.data;
    },

    addCoursesToSchedule: async (scheduleId) => {
        const response = await api.post(`${SCHEDULE_API_URL}/${scheduleId}/add`);
        return response.data;
    },

    dropCourseFromSchedule: async (scheduleId, courseId) => {
        const response = await api.post(`${SCHEDULE_API_URL}/${scheduleId}/drop`, { courseId });
        return response.data;
    }
}

export default ScheduleService;