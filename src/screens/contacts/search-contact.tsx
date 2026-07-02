import { Chip } from "heroui-native/chip";
import { SearchField } from "heroui-native/search-field";
import { View, Text, ScrollView } from "react-native";

type SearchContactProps = {
  searchValue: string;
  setSearchValue: (query: string) => void;
};

export function SearchFilterContact({ searchValue, setSearchValue }: SearchContactProps) {
  return (
    <View className="gap-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex flex-row gap-2">
          {["Builder", "Electrician", "Plumber", "Nanny", "Rag-picker"].map((item) => (
            <Chip variant="soft" key={item}>
              <Chip.Label>
                <Text>{item}</Text>
              </Chip.Label>
            </Chip>
          ))}
        </View>
      </ScrollView>
      <SearchField value={searchValue} onChange={setSearchValue}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input className="text-base" placeholder="Search by name or profession" />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
    </View>
  );
}
