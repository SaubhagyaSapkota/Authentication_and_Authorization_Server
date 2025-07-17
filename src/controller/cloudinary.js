import  {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map((file) => {
        const base64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;

        return cloudinary.uploader.upload(dataUri, {
          folder: "feedback_images",
          resource_type: "image", // default, but kept for clarity
        });
      })
    );

    const imagesData = uploadResults.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
    }));

    res.status(200).json({
      message: "Images uploaded successfully",
      images: imagesData,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Failed to upload images", error });
  }
};


export const uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No documents uploaded" });
    }

    const uploadResults = await Promise.all(
      req.files.map((file) => {
        const base64 = file.buffer.toString("base64");
        const dataUri = `data:${file.mimetype};base64,${base64}`;

        return cloudinary.uploader.upload(dataUri, {
          folder: "pdf_documents",
          resource_type: "raw", // Important for pdfs and non-images
          format: "pdf"
        });
      })
    );

    const docsData = uploadResults.map((result) => ({
      url: result.secure_url,
      public_id: result.public_id,
      original_filename: result.original_filename,
      format: result.format, // should be 'pdf'
    }));

    res.status(200).json({
      message: "Documents uploaded successfully",
      documents: docsData,
    });
  } catch (error) {
    console.error("Error uploading documents:", error);
    res.status(500).json({ message: "Failed to upload documents", error });
  }
};

