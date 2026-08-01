import { theme } from "../lib/runtime";

export default function FeedbackBanner({ message, variant = "default" }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={variant === "warning" ? theme.warning : theme.feedback}
      role="status"
    >
      {message}
    </div>
  );
}
