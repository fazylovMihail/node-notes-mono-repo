import { FC } from "react";

interface ErrorLabelProps {
  message: string;
}

export const ErrorLabel: FC<ErrorLabelProps> = ({ message }) => {
  return <div className="error-label">{message}</div>;
};

ErrorLabel.displayName = "ErrorLabel";
