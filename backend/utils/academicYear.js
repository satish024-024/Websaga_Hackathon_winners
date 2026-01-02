// Get current academic year based on June-May cycle
const getCurrentAcademicYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed (0 = January, 5 = June)

    // If current month is June (5) or later, academic year starts this year
    // Otherwise, it started last year
    if (currentMonth >= 5) { // June onwards
        return `${currentYear}-${currentYear + 1}`;
    } else {
        return `${currentYear - 1}-${currentYear}`;
    }
};

// Get academic year from a specific date
const getAcademicYearFromDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();

    if (month >= 5) { // June onwards
        return `${year}-${year + 1}`;
    } else {
        return `${year - 1}-${year}`;
    }
};

// Validate academic year format (YYYY-YYYY)
const isValidAcademicYear = (yearString) => {
    const regex = /^\d{4}-\d{4}$/;
    if (!regex.test(yearString)) {
        return false;
    }

    const [startYear, endYear] = yearString.split('-').map(Number);
    return endYear === startYear + 1;
};

// Get min date for exam date picker (today)
const getMinExamDate = () => {
    return new Date().toISOString().split('T')[0];
};

module.exports = {
    getCurrentAcademicYear,
    getAcademicYearFromDate,
    isValidAcademicYear,
    getMinExamDate
};
