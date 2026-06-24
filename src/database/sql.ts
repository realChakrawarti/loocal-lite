const location = {
  drop: "DROP TABLE locations;",
  insert:
    "INSERT INTO locations (id, digipin, latitude, longitude, title, description) VALUES (?, ?, ?, ?, ?, ?);",
  deleteById: "DELETE FROM locations WHERE id = ?;",
  deleteAll: "DELETE FROM locations;",
  getAll: "SELECT * FROM locations;",
  init: `
	CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      digipin TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      updated_at INTEGER DEFAULT (strftime('%s','now'))
    );
  `,
};

const sql = {
  location,
} as const;

export default sql;
