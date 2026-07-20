import { FC, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Select } from "../Select";
import { Input } from "../Input";
import { Option } from "../Select";

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
    const { register, setValue, control } = useForm<SearchNote>({
      resolver: zodResolver(SearchNoteSchema),
      defaultValues: {
        sort: "month",
        search: "",
      },
    });

    const sort = useWatch({ control, name: "sort" });
    const search = useWatch({ control, name: "search" });
    const firstRun = useRef(true);

    const searchOptions = useMemo<Option<NoteSort>[]>(
      () => [
        { value: "month", labelText: "за месяц" },
        { value: "three-month", labelText: "за 3 месяца" },
        { value: "all-time", labelText: "за всё время" },
      ],
      [],
    );

    useEffect(() => {
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }

      onSearch({ sort, search, isArchive });
    }, [sort, search, isArchive, onSearch]);

    const handleResetInput = useCallback(() => {
      setValue("search", "", { shouldValidate: true, shouldDirty: true });
    }, [setValue]);

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
