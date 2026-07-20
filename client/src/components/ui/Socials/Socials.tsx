import { FC, HTMLProps } from "react";
import { Link } from "../Link";
import { createClassNames, Social } from "@client/utils";

import "./Socials.scss";

interface SocialsProps extends HTMLProps<HTMLUListElement> {
  socials: Social[];
  modificators?: string[];
}

export const Socials: FC<SocialsProps> = ({
  socials,
  modificators,
  ...props
}) => {
  const classNames = createClassNames("socials", modificators);

  return (
    <ul className={classNames} {...props}>
      {socials.map(({ link, iconId, width, height }, index) => (
        <li key={index} className="socials__item">
          <Link
            to={link}
            target="_blank"
            iconId={iconId}
            width={width}
            height={height}
          />
        </li>
      ))}
    </ul>
  );
};
