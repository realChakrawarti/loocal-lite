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
		remarks TEXT,
		primary_number TEXT CHECK(json_valid(primary_number)) NOT NULL,
		secondary_number TEXT CHECK(secondary_number IS NULL OR json_valid(secondary_number)),
		tertiary_number TEXT CHECK(tertiary_number IS NULL OR json_valid(tertiary_number)),
	 	created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER DEFAULT (strftime('%s','now'))
	);
	`,
  getById: "SELECT * FROM contacts WHERE id = ?;",
  getAll: "SELECT * FROM contacts;",
  insert:
    "INSERT INTO contacts (id, fullname, thumbnail, remarks, primary_number, secondary_number, tertiary_number) VALUES (?, ?, ?, ?, ?, ?, ?);",
};

const sqlStatements = {
  location,
  contact,
} as const;

export default sqlStatements;
