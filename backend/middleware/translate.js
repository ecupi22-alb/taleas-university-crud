// Simple translation: if Accept-Language is "sq" we return Albanian, else English
const messages = {
  en: {
    student_created: 'Student created successfully',
    student_updated: 'Student updated successfully',
    student_deleted: 'Student deleted successfully',
    student_not_found: 'Student not found',
    course_created: 'Course created successfully',
    course_updated: 'Course updated successfully',
    course_deleted: 'Course deleted successfully',
    course_not_found: 'Course not found',
    enrolled: 'Student enrolled in course successfully',
    unenrolled: 'Enrollment removed successfully',
    enrollment_not_found: 'Enrollment not found',
    already_enrolled: 'Student is already enrolled in this course',
    invalid_ids: 'Invalid student or course id',
    server_error: 'Something went wrong'
  },
  sq: {
    student_created: 'Studenti u krijua me sukses',
    student_updated: 'Studenti u përditësua me sukses',
    student_deleted: 'Studenti u fshi me sukses',
    student_not_found: 'Studenti nuk u gjet',
    course_created: 'Kursi u krijua me sukses',
    course_updated: 'Kursi u përditësua me sukses',
    course_deleted: 'Kursi u fshi me sukses',
    course_not_found: 'Kursi nuk u gjet',
    enrolled: 'Studenti u regjistrua në kurs me sukses',
    unenrolled: 'Regjistrimi u hoq me sukses',
    enrollment_not_found: 'Regjistrimi nuk u gjet',
    already_enrolled: 'Studenti është tashmë i regjistruar në këtë kurs',
    invalid_ids: 'ID e pavlefshme e studentit ose kursit',
    server_error: 'Diçka shkoi keq'
  }
};

// Middleware: attach t() to req so controllers can use req.t('key')
function translate(req, res, next) {
  const lang = (req.get('Accept-Language') || '').toLowerCase().startsWith('sq') ? 'sq' : 'en';
  req.t = (key) => messages[lang][key] || messages.en[key] || key;
  next();
}

module.exports = translate;
