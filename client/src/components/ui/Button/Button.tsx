import { ButtonHTMLAttributes, FC } from "react";
import { Icon } from "../Icon";
import { createClassNames } from "@client/utils";

import "./Button.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  modificators?: string[];
  iconId?: string;
  width?: number;
  height?: number;
}

export const Button: FC<ButtonProps> = ({
  modificators,
  iconId,
  width,
  height,
  children,
  ...props
}) => {
  const classNames = createClassNames("btn", modificators);

  return (
    <button className={classNames} {...props}>
      {iconId && width && height && (
        <Icon
          className="btn__icon"
          iconId={iconId}
          width={width}
          height={height}
        />
      )}
      {children}
    </button>
  );
};

Button.displayName = "Button";
