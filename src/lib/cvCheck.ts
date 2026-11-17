import fs from "fs";
import path from "path";

/**
 * Startup and build-time verification for CV PDF.
 * Logs a clear warning if the file is missing without crashing.
 */
export function verifyCvFileExists(): boolean {
  try {
    const cvPath = path.join(process.cwd(), "public", "Chethan_Kumar.CV.pdf");
    if (!fs.existsSync(cvPath)) {
      console.warn(
        "\n[CV CHECK WARNING]: /public/Chethan_Kumar.CV.pdf was not found!\n" +
        "Ensure Chethan_Kumar.CV.pdf is placed directly in the /public directory so download links work.\n"
      );
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[CV CHECK ERROR]: Could not check for CV file existence:", err);
    return false;
  }
}

