import { SearchField } from "heroui-native/search-field";

type SearchTagsProps = {
  searchValue: string;
  setSearchValue: (query: string) => void;
};

export default function SearchTags({ searchValue, setSearchValue }: SearchTagsProps) {
  return (
    <SearchField className="px-4 mt-4" value={searchValue} onChange={setSearchValue}>
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input className="text-base" placeholder="Search tags" />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
