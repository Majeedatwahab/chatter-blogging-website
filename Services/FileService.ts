import { storage } from "@/app/firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param file - The file to upload.
 * @param path - The path in Firebase Storage where the file will be stored.
 * @returns The download URL of the uploaded file.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const fileRef = storageRef(storage, path);
    const snapshot = await uploadBytes(fileRef, file);
    console.log("Uploaded a file!");
    const url = await getDownloadURL(snapshot.ref);
    console.log("File available at", url);
    return url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
