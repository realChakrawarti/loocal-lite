import { Description } from "heroui-native/description";
import { SearchField } from "heroui-native/search-field";

type SearchContactProps = {
  searchValue: string;
  setSearchValue: (query: string) => void;
};

export function SearchContact({
  searchValue,
  setSearchValue,
}: SearchContactProps) {
  return (
    <SearchField value={searchValue} onChange={setSearchValue}>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input />
        <SearchField.ClearButton />
      </SearchField.Group>
      <Description>Search by name, profession</Description>
    </SearchField>
  );
}