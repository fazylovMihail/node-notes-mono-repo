import { FC, SelectHTMLAttributes } from "react";
import { Icon } from "../Icon";
import { createClassNames } from "@client/utils";

import "./Select.scss";

export interface Option<T = string> {
  value: T;
  labelText: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option<any>[];
  modificators?: string[];
}

export const Select: FC<SelectProps> = ({
  options,
  modificators,
  ...props
}) => {
  const classNames = createClassNames("select", modificators);

  return (
    <div className={classNames}>
      <select className="select__field" {...props}>
        {options.map((option) => (
          <option
            key={option.value}
            className="select__option"
            value={option.value}
          >
            {option.labelText}
          </option>
        ))}
      </select>
      <Icon
        className="select__icon"
        iconId="icon-select"
        width={10}
        height={20}
      />
    </div>
  );
};
