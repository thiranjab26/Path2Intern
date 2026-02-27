import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        company: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },

        workMode: {
            type: String,
            enum: ["Remote", "Hybrid", "On-site"],
            default: "Hybrid",
        },

        type: {
            type: String,
            enum: ["Internship", "Part-time", "Full-time"],
            default: "Internship",
        },

        duration: { type: String, default: "" },     // e.g. "3 months"
        salary: { type: String, default: "" },        // e.g. "LKR 25,000/month"
        skills: { type: [String], default: [] },      // ["React", "Node.js"]
        requirements: { type: String, default: "" },  // free-text

        deadline: { type: Date, default: null },

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "closed"],
            default: "active",
        },
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
