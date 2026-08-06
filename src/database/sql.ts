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
  update:
    "UPDATE contacts SET fullname = ?, thumbnail = ?, remarks = ?, primary_number = ?, secondary_number = ?, tertiary_number = ?, updated_at = strftime('%s','now') WHERE id = ?;",
};

const tag = {
  init: `
	CREATE TABLE IF NOT EXISTS tags (
		id TEXT PRIMARY KEY,
		name TEXT UNIQUE NOT NULL,
 		created_at INTEGER DEFAULT (strftime('%s','now')),
    updated_at INTEGER DEFAULT (strftime('%s','now'))
	);
	`,
  insert: "INSERT INTO tags (id, name) VALUES (?, ?);",
  deleteById: "DELETE FROM tags WHERE id = ?;",
  getAll: "SELECT * FROM tags;",
  update: "UPDATE tags SET name = ?, updated_at = strftime('%s','now') WHERE id = ?;",
};

const contactTag = {
  init: `
		CREATE TABLE IF NOT EXISTS contact_tag (
			contact_id TEXT NOT NULL,
			tag_id TEXT NOT NULL,
			PRIMARY KEY (contact_id, tag_id),
			FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
			FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
		);
	`,
  insert: "INSERT INTO contact_tag (contact_id, tag_id) VALUES (?, ?);",
  getById: `
  	SELECT t.name, t.id FROM contact_tag ct
   	INNER JOIN tags t ON t.id = ct.tag_id
    WHERE ct.contact_id = ?;
  `,
  deleteById: "DELETE FROM contact_tags WHERE contact_id = ? AND tag_id = ?;",
  filterByTag: (tags: string[]) => {
    const tagList = tags.map((tag) => `'${tag}'`).join(", ");
    return `
	 	SELECT DISTINCT c.*
	  FROM contacts c
	  INNER JOIN contact_tag ct ON c.id = ct.contact_id
	  WHERE ct.tag_id IN (${tagList});
  `;
  },
};

const sqlStatements = {
  location,
  contact,
  tag,
  contactTag,
} as const;

export default sqlStatements;
