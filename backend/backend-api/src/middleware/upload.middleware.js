import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * multer 설정:
 * - file-storage 폴더에 저장
 * - 파일명 = timestamp + 랜덤값
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve("file-storage");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage });
