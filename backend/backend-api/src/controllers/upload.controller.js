export const uploadImage = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "파일이 없습니다." });

    const imageUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
