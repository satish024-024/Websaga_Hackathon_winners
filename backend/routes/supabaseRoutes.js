const express = require('express');
const router = express.Router();
const multer = require('multer');

const adminController = require('../controller/adminControllerSupabase');
const qpController = require('../controller/qpControllerSupabase');
const authController = require('../controller/authControllerSupabase');
const facultyController = require('../controller/facultyControllerSupabase');
const uploadController = require('../controller/uploadControllerCloudinary');

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// --- AUTH ROUTES ---
router.post('/auth/login', authController.login);
router.post('/auth/create-user', authController.createUser);

// --- UPLOAD ROUTES ---
router.post('/upload/question-image', upload.single('image'), uploadController.uploadQuestionImage);

// --- ADMIN ROUTES ---
router.post('/admin/programs', adminController.createProgram);
router.get('/admin/programs', adminController.getPrograms);
router.put('/admin/programs/:id', adminController.updateProgram);
router.delete('/admin/programs/:id', adminController.deleteProgram);
router.patch('/admin/programs/:id/toggle', adminController.toggleProgramStatus);

router.post('/admin/branches', adminController.createBranch);
router.get('/admin/branches', adminController.getBranches);
router.put('/admin/branches/:id', adminController.updateBranch);
router.delete('/admin/branches/:id', adminController.deleteBranch);
router.patch('/admin/branches/:id/toggle', adminController.toggleBranchStatus);

router.post('/admin/regulations', adminController.createRegulation);
router.get('/admin/regulations', adminController.getRegulations);
router.put('/admin/regulations/:id', adminController.updateRegulation);
router.delete('/admin/regulations/:id', adminController.deleteRegulation);
router.patch('/admin/regulations/:id/toggle', adminController.toggleRegulationStatus);

router.post('/admin/pb-mapping', adminController.mapProgramBranch);

router.get('/admin/pb-mapping', adminController.getProgramBranchMappings);

router.post('/admin/courses', adminController.createCourse);
router.get('/admin/courses', adminController.getCourses);


// --- FACULTY ROUTES ---
router.post('/faculty', facultyController.createFaculty);
router.get('/faculty', facultyController.getAllFaculty);
router.get('/faculty/:id', facultyController.getFacultyById);
router.put('/faculty/:id', facultyController.updateFaculty);
router.delete('/faculty/:id', facultyController.deleteFaculty);
router.patch('/faculty/:id/toggle-status', facultyController.toggleFacultyStatus);
router.post('/faculty/bulk-upload', upload.single('file'), facultyController.bulkUploadFaculty);

// --- QP ROUTES ---
router.get('/qp/bloom-levels', qpController.getBloomLevels);
router.get('/qp/difficulty-levels', qpController.getDifficultyLevels);
router.get('/qp/units', qpController.getUnits);

router.get('/plugins', qpController.getPlugins);

router.post('/course-outcomes', qpController.createCourseOutcome);
router.get('/course-outcomes', qpController.getCourseOutcomes);
router.get('/qp/course-outcomes/:course_id', qpController.getCourseOutcomesByCourseId);

router.post('/questions', qpController.createQuestion);
router.get('/questions', qpController.getQuestions);

router.post('/qp/select-random', qpController.selectRandomQuestions);

module.exports = router;

