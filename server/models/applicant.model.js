import mongoose from "mongoose";

const applicantSchema = mongoose.Schema(
    {
        prename: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        surname: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 50
        },
        birthdate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value.getTime() < Date.now();
                },
                message: "Birthdate must be in the past."
            }
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            type: String,
            required: true,
            match: /^\+?[1-9]\d{1,14}$/
        },
        education: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 30
        },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true, match: /^[A-Za-z0-9\s\-]+$/ },
            country: { type: String, required: true }
        },
        curriculumVitae: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 2000
        },
        motivation: {
            type: String,
            required: true,
            minlength: 10,
            maxlength: 2000
        },
        vacancy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vacancy"
        },
        photo: {
            type: String,
            required: false,
            default: null
        },
        status: {
            type: String,
            required: true,
            enum: ["Applied", "Interview Scheduled", "Hired", "Rejected"],
            default: "Applied"
        },
        suitabilityScore: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        }
    },
    { timestamps: true}
);

const Applicant = mongoose.model("Applicant", applicantSchema)

export default Applicant