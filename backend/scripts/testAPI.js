const axios = require('axios');

async function testAPI() {
    try {
        // Test 1: Get Programs
        console.log('Testing GET /api/admin/programs...');
        const getRes = await axios.get('http://localhost:4000/api/admin/programs');
        console.log('✅ GET Programs:', getRes.data);

        // Test 2: Get PB Mappings
        console.log('\nTesting GET /api/admin/pb-mapping...');
        const pbRes = await axios.get('http://localhost:4000/api/admin/pb-mapping');
        console.log('✅ GET PB Mappings:', pbRes.data);

        // Test 3: Try to add a course (this will fail if no mappings exist)
        console.log('\nTesting POST /api/admin/courses...');

        if (pbRes.data.data && pbRes.data.data.length > 0) {
            const firstMapping = pbRes.data.data[0];

            // Get regulation
            const regRes = await axios.get('http://localhost:4000/api/admin/regulations');
            const firstReg = regRes.data.data[0];

            const courseData = {
                course_name: 'Test Course',
                course_code: 'TEST101',
                program_branch_id: firstMapping.id,
                regulation_id: firstReg.id,
                year: 'I',
                semester: 'I',
                course_type: 'Theory',
                elective_type: 'CORE',
                credits: 3
            };

            console.log('Course data:', courseData);
            const courseRes = await axios.post('http://localhost:4000/api/admin/courses', courseData);
            console.log('✅ POST Course:', courseRes.data);
        } else {
            console.log('⚠️ No PB Mappings found. Run: node scripts/setupAcademicData.js');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testAPI();
