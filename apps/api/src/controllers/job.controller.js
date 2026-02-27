import { Job } from "../models/job.model.js";

const EDIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// GET /api/jobs  — public, all active jobs newest first
export const getJobs = async (req, res) => {
    try {
        const { search, workMode, type } = req.query;
        const filter = { status: "active" };
        if (workMode) filter.workMode = workMode;
        if (type) filter.type = type;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { skills: { $elemMatch: { $regex: search, $options: "i" } } },
                { location: { $regex: search, $options: "i" } },
            ];
        }
        const jobs = await Job.find(filter)
            .populate("postedBy", "name email organizationName")
            .sort({ createdAt: -1 })
            .lean();
        res.json({ total: jobs.length, jobs });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// GET /api/jobs/mine  — org only, their own jobs
export const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.userId })
            .sort({ createdAt: -1 })
            .lean();

        // Annotate each with whether the 10-min edit window is still open
        const now = Date.now();
        const annotated = jobs.map((j) => ({
            ...j,
            canEdit: now - new Date(j.createdAt).getTime() < EDIT_WINDOW_MS,
            editExpiresAt: new Date(new Date(j.createdAt).getTime() + EDIT_WINDOW_MS),
        }));
        res.json({ total: annotated.length, jobs: annotated });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};

// POST /api/jobs  — org only
export const createJob = async (req, res) => {
    try {
        const { title, description, company, location, workMode, type, duration, salary, skills, requirements, deadline } = req.body;
        if (!title || !description || !company || !location) {
            return res.status(400).json({ message: "title, description, company and location are required" });
        }
        const job = await Job.create({
            title,
            description,
            company,
            location,
            workMode: workMode || "Hybrid",
            type: type || "Internship",
            duration: duration || "",
            salary: salary || "",
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : []),
            requirements: requirements || "",
            deadline: deadline ? new Date(deadline) : null,
            postedBy: req.user.userId,
        });
        res.status(201).json({ message: "Job posted successfully", job });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

// PUT /api/jobs/:id  — org only, within 10 min of creation
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only edit your own job posts" });
        }

        const age = Date.now() - new Date(job.createdAt).getTime();
        if (age > EDIT_WINDOW_MS) {
            return res.status(403).json({ message: "The 10-minute edit window has expired. You can only delete this post now." });
        }

        const { title, description, company, location, workMode, type, duration, salary, skills, requirements, deadline } = req.body;
        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        if (company !== undefined) job.company = company;
        if (location !== undefined) job.location = location;
        if (workMode !== undefined) job.workMode = workMode;
        if (type !== undefined) job.type = type;
        if (duration !== undefined) job.duration = duration;
        if (salary !== undefined) job.salary = salary;
        if (skills !== undefined) job.skills = Array.isArray(skills) ? skills : skills.split(",").map((s) => s.trim()).filter(Boolean);
        if (requirements !== undefined) job.requirements = requirements;
        if (deadline !== undefined) job.deadline = deadline ? new Date(deadline) : null;

        await job.save();
        res.json({ message: "Job updated", job });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
};

// DELETE /api/jobs/:id  — org only, anytime
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        if (job.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only delete your own job posts" });
        }
        await Job.deleteOne({ _id: job._id });
        res.json({ message: "Job deleted" });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};
