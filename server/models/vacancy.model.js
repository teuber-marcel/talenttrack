import mongoose from "mongoose";

const vacancySchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100
        },
        department: {
            type: String,
            required: true,
            enum: {
                values: [
                    "accounting", "finance", "riskAndCompliance",
                    "humanResources", "it", "marketing", "production",
                    "projectManagement", "researchAndDevelopment", "sales"
                ],
                message: "{VALUE} is not a valid department"
            },
            default: "accounting"
        },
        hierarchy: {
            type: String,
            required: true,
            enum: {
                values: [
                    "workingStudent", "intern", "juniorProfessional", "professional",
                    "seniorProfessional", "executiveProfessional", "teamLead", "manager", "director", "executiveDirector"
                ], 
                message : "{VALUE} is not a valid hierarchy"
            },
            default:"workingStudent"
        },
        description: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1000
        },
        requirements: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1000
        },
        other: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 1000
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: [
                    "Draft","Open","Interview","Filled"
                ],
                message: "{VALUE} is not a valid status"
            },
            default: "Draft"
        },
    },
    { timestamps: true}
)

const Vacancy = mongoose.model("Vacancy", vacancySchema)

export default Vacancy