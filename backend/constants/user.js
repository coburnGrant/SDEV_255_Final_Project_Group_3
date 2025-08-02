
class UserRole {
    static SUPER_ADMIN = "super-admin"
    static ADMIN = "admin";
    static TEACHER = "teacher";
    static STUDENT = "student";

    static allRoles() {
        return [this.SUPER_ADMIN, this.ADMIN, this.TEACHER, this.STUDENT];
    }
}

module.exports = { UserRole };