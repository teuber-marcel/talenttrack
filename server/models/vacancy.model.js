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
                    "Accounting", "Finance", "Risk & Compliance",
                    "Human Resources", "IT", "Marketing", "Production",
                    "Project Management", "Research & Development", "Sales"
                ],
                message: "{VALUE} is not a valid department"
            },
            default: "Accounting"
        },
        hierarchy: {
            type: String,
            required: true,
            enum: {
                values: [
                    "Working Student", "Intern", "Junior Professional", "Professional",
                    "Senior Professional", "Executive Professional", "Team Lead", "Manager", "Director", "Executive Director"
                ], 
                message : "{VALUE} is not a valid hierarchy"
            },
            default:"Working Student"
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
                    "Draft","Open","Filled"
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