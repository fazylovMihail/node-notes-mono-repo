import { FC, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  iconId: string;
}

export const Icon: FC<IconProps> = ({ iconId, ...props }) => {
  return (
    <svg {...props} aria-hidden="true">
      <use href={`/sprite.svg#${iconId}`} />
    </svg>
  );
};
