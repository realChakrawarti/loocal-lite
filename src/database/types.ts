export type TagsType = {
  id: string;
  name: string;
};

export type ContactNumber = {
  number: string;
  platform: { whatsapp: boolean };
};

export type ContactsType = {
  id: string;
  created_at: number;
  updated_at: number;
  fullname: string;
  thumbnail: string;
  remarks: string;
  primary_number: ContactNumber;
  secondary_number: ContactNumber | null;
  tertiary_number: ContactNumber | null;
};

export type ContactsTypeRaw = {
  id: string;
  created_at: number;
  updated_at: number;
  fullname: string;
  thumbnail: string;
  remarks: string;
  primary_number: string;
  secondary_number: string | null;
  tertiary_number: string | null;
};
