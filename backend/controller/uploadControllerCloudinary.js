const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadQuestionImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, msg: 'No file uploaded' });
        }

        // Convert buffer to base64
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'websaga/questions',
            resource_type: 'auto'
        });

        return res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });

    } catch (error) {
        console.error('Image upload error:', error);
        return res.status(500).json({ success: false, msg: error.message });
    }
};

module.exports = {
    uploadQuestionImage
};
