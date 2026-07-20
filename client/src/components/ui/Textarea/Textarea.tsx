import { createClassNames } from "@client/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

import "./Textarea.scss";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  modificators?: string[];
  labelText?: string;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ modificators, labelText, autoResize = false, id, ...props }, ref) => {
    const classNames = createClassNames("textarea", modificators);

    return (
      <div className={classNames}>
        <textarea
          {...props}
          ref={ref}
          className="textarea__field"
          id={id}
        ></textarea>
        {labelText && (
          <label className="textarea__label" htmlFor={id}>
            {labelText}
          </label>
        )}
      </div>
    );
  },
);
