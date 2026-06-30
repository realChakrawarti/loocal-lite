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

const contact = {
  init: `
	CREATE TABLE IF NOT EXISTS contacts (
		id TEXT PRIMARY KEY,
		fullname TEXT NOT NULL,
		thumbnail TEXT,
		primary_number TEXT CHECK(json_valid(primary_number)) NOT NULL,
		secondary_number TEXT CHECK(json_valid(secondary_number)),
		tertiary_number TEXT CHECK(json_valid(tertiary_number)),
	 	created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER DEFAULT (strftime('%s','now'))
	);
	`,
  getAll: "SELECT * FROM locations;",
  insert:
    "INSERT INTO contacts (id, fullname, thumbnail, primary_number, secondary_number, tertiary_number) VALUES (?, ?, ?, ?, ?, ?);",
};

const sqlStatements = {
  location,
  contact,
} as const;

export default sqlStatements;
