import express from "express";
import {
  generateCoverLetter,
  generateJobDescription,
  generateColdEmail,
} from "../ai/aiClient.js";

const router = express.Router();

router.post("/ai/cover-letter", async (req, res) => {
  try {
    const body = req.body || {};
    const tone = typeof body.tone === "number" ? body.tone : 50;
    const toneLabel = tone < 33 ? "Safe" : tone > 66 ? "Bold" : "Neutral";

    const jobAnalysis = body.jobAnalysis || {};
    const resumeHighlights = body.resumeHighlights || {};

    const letter = await generateCoverLetter({
      jobTitle: jobAnalysis.title || "Software Engineer",
      company: jobAnalysis.company || "Company",
      location: jobAnalysis.location || "",
      resumeExperience: resumeHighlights.experience || "",
      resumeSkills: Array.isArray(resumeHighlights.skills)
        ? resumeHighlights.skills
        : [],
      education: resumeHighlights.education || "",
      keywords: Array.isArray(jobAnalysis.keywords)
        ? jobAnalysis.keywords
        : [],
      extraPrompt: body.prompt || "",
      toneLabel,
    });

    res.json({
      ok: true,
      letter,
      meta: {
        tone,
        toneLabel,
        modelLabel: body.modelLabel || "gpt-4.1-mini",
      },
    });
  } catch (error) {
    console.error("ai cover-letter error:", error);
    res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : "server error",
    });
  }
});

router.post("/ai/job-description", async (req, res) => {
  try {
    const body = req.body || {};
    const jobTitleRaw = typeof body.jobTitle === "string" ? body.jobTitle : "";
    const jobTitle = jobTitleRaw.trim();

    if (!jobTitle) {
      return res
        .status(400)
        .json({ ok: false, error: "jobTitle is required" });
    }

    const jd = await generateJobDescription({
      jobTitle,
      department:
        typeof body.department === "string" ? body.department : undefined,
      location:
        typeof body.location === "string" ? body.location : undefined,
      reportTo: typeof body.reportTo === "string" ? body.reportTo : undefined,
      responsibilities:
        typeof body.responsibilities === "string"
          ? body.responsibilities
          : undefined,
      requirements:
        typeof body.requirements === "string"
          ? body.requirements
          : undefined,
      idealProfile:
        typeof body.idealProfile === "string"
          ? body.idealProfile
          : undefined,
      extraPrompt: typeof body.prompt === "string" ? body.prompt : undefined,
    });

    res.json({ ok: true, jd });
  } catch (error) {
    console.error("ai job-description error:", error);
    res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : "server error",
    });
  }
});

router.post("/ai/cold-email", async (req, res) => {
  try {
    const body = req.body || {};
    const companyNameRaw =
      typeof body.companyName === "string" ? body.companyName : "";
    const goalRaw = typeof body.goal === "string" ? body.goal : "";

    const companyName = companyNameRaw.trim();
    const goal = goalRaw.trim();

    if (!companyName || !goal) {
      return res.status(400).json({
        ok: false,
        error: "companyName and goal are required",
      });
    }

    const email = await generateColdEmail({
      senderRole:
        typeof body.senderRole === "string"
          ? body.senderRole
          : "在美中国工程师",
      recipientRole:
        typeof body.recipientRole === "string"
          ? body.recipientRole
          : "招聘负责人",
      companyName,
      goal,
      commonGround:
        typeof body.commonGround === "string" ? body.commonGround : undefined,
      callToAction:
        typeof body.callToAction === "string"
          ? body.callToAction
          : undefined,
      extraPrompt: typeof body.prompt === "string" ? body.prompt : undefined,
    });

    res.json({ ok: true, email });
  } catch (error) {
    console.error("ai cold-email error:", error);
    res.status(500).json({
      ok: false,
      error: error && error.message ? error.message : "server error",
    });
  }
});

export default router;

