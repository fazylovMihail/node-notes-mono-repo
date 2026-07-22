import { forwardRef, InputHTMLAttributes, KeyboardEvent } from "react";
import { Icon } from "../Icon";
import { Button } from "../Button";
import { createClassNames } from "@client/utils";

import "./Input.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  modificators?: string[];
  iconId?: string;
  labelText?: string;
  errorText?: string;
  isRequire?: boolean;
  isSearch?: boolean;
  onReset?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      iconId,
      modificators,
      id,
      labelText,
      errorText,
      isRequire = false,
      isSearch = false,
      onReset,
      ...props
    },
    ref,
  ) => {
    const classNames = createClassNames("custom-input", modificators);

    return (
      <div className={classNames}>
        <input {...props} ref={ref} className="custom-input__field" id={id} />
        {iconId && (
          <Icon
            className="custom-input__icon"
            iconId={iconId}
            width={20}
            height={20}
          />
        )}
        {isSearch && onReset && (
          <Button
            modificators={[
              "without-background",
              "search",
              "custom-input__cancel",
            ]}
            onClick={onReset}
            type="button"
            iconId="icon-cross"
            width={20}
            height={20}
          />
        )}
        {labelText && (
          <label className="custom-input__label" htmlFor={id}>
            {labelText}
            {isRequire && <span className="custom-input__label-star">*</span>}
          </label>
        )}
        {errorText && (
          <span className="custom-input__error-label">{errorText}</span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
