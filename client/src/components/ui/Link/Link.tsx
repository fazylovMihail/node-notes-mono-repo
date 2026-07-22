import { FC } from "react";
import { Icon } from "../Icon";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { createClassNames } from "@client/utils";

import "./Link.scss";

interface LinkProps extends RouterLinkProps {
  modificators?: string[];
  iconId?: string;
  width?: number;
  height?: number;
}

export const Link: FC<LinkProps> = ({
  className = "link",
  iconId,
  modificators,
  width = undefined,
  height = undefined,
  children,
  ...props
}) => {
  const classNames = createClassNames(className, modificators);

  return (
    <RouterLink className={classNames} {...props}>
      {iconId && (
        <Icon
          iconId={iconId}
          className="link__icon"
          width={width}
          height={height}
        />
      )}
      {children}
    </RouterLink>
  );
};

Link.displayName = "Link";
