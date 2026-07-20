import { Socials } from "@client/components/";
import { socials } from "@client/utils";

import "./Footer.scss";

export function Footer() {
  return (
    <div className="footer">
      <div className="container">
        <Socials socials={socials} />
      </div>
    </div>
  );
}
