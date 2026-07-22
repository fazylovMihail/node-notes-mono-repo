import { FC, memo, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Select, Option } from "../Select";
import { Input } from "../Input";
import "./SearchForm.scss";

const NoteSortSchema = z.enum(["month", "three-month", "all-time"]);
type NoteSort = z.infer<typeof NoteSortSchema>;

const SearchNoteSchema = z.object({
  sort: NoteSortSchema,
  search: z.string(),
});
type SearchNote = z.infer<typeof SearchNoteSchema>;

interface SearchFormProps {
  isArchive: boolean;
  onSearch: (data: SearchNote & { isArchive: boolean }) => void;
}

export const SearchForm: FC<SearchFormProps> = memo(
  ({ isArchive, onSearch }) => {
    const { register, setValue, watch } = useForm<SearchNote>({
      resolver: zodResolver(SearchNoteSchema),
      defaultValues: {
        sort: "month",
        search: "",
      },
    });

    const formValues = watch();

    const searchOptions = useMemo<Option<NoteSort>[]>(
      () => [
        { value: "month", labelText: "за месяц" },
        { value: "three-month", labelText: "за 3 месяца" },
        { value: "all-time", labelText: "за всё время" },
      ],
      [],
    );

    useEffect(() => {
      onSearch({ ...formValues, isArchive });
    }, [formValues.sort, formValues.search, isArchive]);

    const handleResetInput = () => {
      setValue("search", "", { shouldValidate: true, shouldDirty: true });
    };

    return (
      <div className="search-form">
        <Select {...register("sort")} options={searchOptions} />
        <Input
          {...register("search")}
          modificators={["search"]}
          iconId="icon-search"
          isSearch
          onReset={handleResetInput}
          type="search"
          autoComplete="off"
        />
      </div>
    );
  },
);

SearchForm.displayName = "SearchForm";
