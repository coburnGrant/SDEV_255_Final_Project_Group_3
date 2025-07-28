import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserService } from '../services/UserService';

export default function Account() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'super-admin':
                return 'Super Administrator';
            case 'admin':
                return 'Administrator';
            case 'teacher':
                return 'Teacher';
            case 'student':
                return 'Student';
            default:
                return role;
        }
    };

    if (!user) {
        return (
            <div className="container mt-4">
                <div className="alert alert-info">
                    Loading account information...
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-ivy-tech text-white">
                            <h3 className="my-1">
                                <i className="fas fa-user-circle me-2"></i>
                                Account Details
                            </h3>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="username" className="form-label fw-bold">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            value={user.username}
                                            disabled
                                        />
                                        <small className="text-muted">Username cannot be changed</small>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="role" className="form-label fw-bold">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="role"
                                            value={getRoleDisplayName(user.role)}
                                            disabled
                                        />
                                        <small className="text-muted">Role is managed by administrators</small>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label fw-bold">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={user.firstName}
                                            disabled
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label fw-bold">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={user.lastName}
                                            disabled
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={user.email}
                                        disabled
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Account Information</label>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                <strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                <strong>Last Updated:</strong> {new Date(user.updatedAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt me-1"></i>
                                        Logout
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}