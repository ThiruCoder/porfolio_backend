import mongoose from "mongoose";

const ProjectDatabaseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project name is required'],
        minLength: [5, 'Must be minimum length is 5'],
        maxLength: [60, 'Maximum length is 60'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Project description is required'],
        minLength: [5, 'Must be minimum length is 5'],
        maxLength: [600, 'Maximum length is 600']
    },
    url: {
        type: String,
        required: [true, "URL is required"],
        trim: true,
        validate: {
            validator: function (value) {
                return /^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(:\d+)?(\/.*)?$/i.test(value);
            },
            message: "Invalid URL format",
        },
    },
    image: {
        name: { type: String, required: true },
        url: { type: String, required: true },
        public_id: { type: String, required: true }
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    tags: { type: [String], default: [] },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})
// ProjectDatabaseSchema.index({ tags: 'text' });

const ProjectModel = mongoose.model('Project', ProjectDatabaseSchema)
export default ProjectModel;