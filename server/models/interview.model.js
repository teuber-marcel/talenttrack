import mongoose from "mongoose";

const interviewSchema = mongoose.Schema(
    {
        interviewStartDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value.getTime() > Date.now();
                },
                message: "Interview date must be in the future."
            }
        },
        interviewEndDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value.getTime() > Date.now();
                },
                message: "Interview date must be in the future."
            }
        },
        questions: {
            type: [String],
            default: []
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Applicant",
            required: true
        }
    },
    { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema)

export default Interview