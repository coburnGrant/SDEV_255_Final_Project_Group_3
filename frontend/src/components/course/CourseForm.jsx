import { useState, useEffect } from 'react';

function CourseForm({ course = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    prefix: '',
    number: '',
    name: '',
    program: '',
    description: '',
    prerequisites: '',
    creditHoursMin: '',
    creditHoursMax: '',
    lectureHoursMin: '',
    dateOfLastRevision: '',
    learningObjectives: '',
    topics: ''
  });

  useEffect(() => {
    if (course) {
      setFormData({
        ...formData,
        ...course,
        prerequisites: (course.prerequisites || []).join(', '),
        learningObjectives: (course.learningObjectives || []).join(', '),
        topics: (course.topics || []).join(', '),
        dateOfLastRevision: course.dateOfLastRevision
          ? new Date(course.dateOfLastRevision).toISOString().split('T')[0]
          : ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      prerequisites: formData.prerequisites
        ? formData.prerequisites.split(',').map(s => s.trim())
        : [],
      learningObjectives: formData.learningObjectives
        ? formData.learningObjectives.split(',').map(s => s.trim())
        : [],
      topics: formData.topics
        ? formData.topics.split(',').map(s => s.trim())
        : [],
      creditHoursMin: Number(formData.creditHoursMin),
      creditHoursMax: formData.creditHoursMax ? Number(formData.creditHoursMax) : undefined,
      lectureHoursMin: formData.lectureHoursMin ? Number(formData.lectureHoursMin) : undefined,
      dateOfLastRevision: formData.dateOfLastRevision
        ? new Date(formData.dateOfLastRevision)
        : undefined
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-3">
        <label className="form-label">Prefix</label>
        <input className="form-control" name="prefix" value={formData.prefix} onChange={handleChange} required />
      </div>

      <div className="col-md-3">
        <label className="form-label">Number</label>
        <input className="form-control" name="number" value={formData.number} onChange={handleChange} required />
      </div>

      <div className="col-md-6">
        <label className="form-label">Program</label>
        <input className="form-control" name="program" value={formData.program} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Course Name</label>
        <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
      </div>

      <div className="col-12">
        <label className="form-label">Description</label>
        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows={3} />
      </div>

      <div className="col-md-6">
        <label className="form-label">Prerequisites (comma separated)</label>
        <input className="form-control" name="prerequisites" value={formData.prerequisites} onChange={handleChange} />
      </div>

      <div className="col-md-3">
        <label className="form-label">Credit Hours Min</label>
        <input type="number" className="form-control" name="creditHoursMin" value={formData.creditHoursMin} onChange={handleChange} required />
      </div>

      <div className="col-md-3">
        <label className="form-label">Credit Hours Max</label>
        <input type="number" className="form-control" name="creditHoursMax" value={formData.creditHoursMax} onChange={handleChange} />
      </div>

      <div className="col-md-3">
        <label className="form-label">Lecture Hours Min</label>
        <input type="number" className="form-control" name="lectureHoursMin" value={formData.lectureHoursMin} onChange={handleChange} />
      </div>

      <div className="col-md-3">
        <label className="form-label">Date of Last Revision</label>
        <input type="date" className="form-control" name="dateOfLastRevision" value={formData.dateOfLastRevision} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Learning Objectives (comma separated)</label>
        <input className="form-control" name="learningObjectives" value={formData.learningObjectives} onChange={handleChange} />
      </div>

      <div className="col-12">
        <label className="form-label">Topics (comma separated)</label>
        <input className="form-control" name="topics" value={formData.topics} onChange={handleChange} />
      </div>

      <div className="col-12 mt-3">
        <button type="submit" className="btn btn-ivy-tech">
          {course?._id ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}

export default CourseForm;