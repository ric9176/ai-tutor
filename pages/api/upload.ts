// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import { promises as fs } from "fs";

export const config = {
  api: {
    bodyParser: false, // Disabling the default Next.js body parser
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/uploads";
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "There was an error parsing the files" });
      return;
    }

    const uploadedFile = files.file as File;

    // Check if the file is a PDF
    if (uploadedFile.mimetype !== "application/pdf") {
      res.status(400).json({ error: "Only PDF files are allowed" });
      return;
    }

    res.status(200).json({
      message: "PDF uploaded successfully",
      filePath: uploadedFile.filepath,
    });
  });
};
