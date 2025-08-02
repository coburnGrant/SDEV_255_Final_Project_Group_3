class ScheduleTerm {
    static SPRING = 'Spring';
    static SUMMER = 'Summer';
    static FALL = 'Fall';

    static allTerms() {
        return [this.SPRING, this.SUMMER, this.FALL];
    }

    static isValidTerm(term) {
        return this.allTerms().includes(term);
    }

    static getTermDates(term, year) {
        switch (term) {
            case this.SPRING:
                return {
                    startDate: new Date(`${year}-01-15`),
                    endDate: new Date(`${year}-05-15`)
                };
            case this.SUMMER:
                return {
                    startDate: new Date(`${year}-06-01`),
                    endDate: new Date(`${year}-08-01`)
                };
            case this.FALL:
                return {
                    startDate: new Date(`${year}-08-15`),
                    endDate: new Date(`${year}-12-15`)
                };
            default:
                throw new Error(`Unknown term: ${term}`);
        }
    }
}

class ScheduleCourseStatus {
    static ENROLLED = 'enrolled';
    static WAITLISTED = 'waitlisted';
    static DROPPED = 'dropped';

    static allStatuses() {
        return [this.ENROLLED, this.WAITLISTED, this.DROPPED];
    }
}

module.exports = {
    ScheduleTerm,
    ScheduleCourseStatus
}