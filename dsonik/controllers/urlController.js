// controllers/urlController.js
const db = require("../config/db");

// ✅ Get all URLs
exports.getAll = (req, res) => {
  const query = "SELECT * FROM url_mst ORDER BY url ASC";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.json(results);
  });
};

// ✅ Get URL by exact value
exports.getById = (req, res) => {
  const { url } = req.params;

  const query = "SELECT * FROM url_mst WHERE url = ?";
  db.query(query, [url], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (!results.length)
      return res.status(404).json({ message: "URL not found" });

    res.json(results[0]);
  });
};

// ✅ Create new URL
exports.create = (req, res) => {
  const { url } = req.body;

  if (!url)
    return res.status(400).json({ error: "URL is required" });

  const sql = "INSERT INTO url_mst (url) VALUES (?)";

  db.query(sql, [url], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.status(201).json({
      message: "URL added successfully",
      url,
    });
  });
};

// ✅ Update URL (oldUrl → newUrl)
exports.update = (req, res) => {
  const { oldUrl } = req.params;
  const { url: newUrl } = req.body;

  const sql = "UPDATE url_mst SET url = ? WHERE url = ?";

  db.query(sql, [newUrl, oldUrl], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "URL not found" });

    res.json({ message: "URL updated successfully" });
  });
};

// ✅ Delete URL
exports.delete = (req, res) => {
  const { url } = req.params;

  const sql = "DELETE FROM url_mst WHERE url = ?";

  db.query(sql, [url], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "URL not found" });

    res.json({ message: "URL deleted successfully" });
  });
};
