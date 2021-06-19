import express from "express";
import JSZip from "jszip";
import buildTemplate from "./compiler";
import { getFile, deployFile } from "./request";

const router = express.Router();

router.post("/generate-template", async (req, res, next) => {
  const { fileUrl, dataSpec, domain } = req.body;

  if (!fileUrl)
    return res.json({
      success: false,
      message: "fileUrl is missing in request body",
    });

  if (!dataSpec)
    return res.json({
      success: false,
      message: "dataSpec is missing in request body",
    });

  if (!domain)
    return res.json({
      success: false,
      message: "domain is missing in request body",
    });

  try {
    const fileData = await getFile(fileUrl);

    const newZip = new JSZip();
    const zip = await newZip.loadAsync(fileData);

    const templateString = await zip.file("index.html").async("string");

    const html = buildTemplate(templateString, dataSpec);

    zip.file("index.html", html);

    const result = zip.generateNodeStream({
      type: "nodebuffer",
      streamFiles: true,
    });

    const deployData = await deployFile(domain, result);

    return res.json({
      success: true,
      message: "done",
      data: deployData,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
