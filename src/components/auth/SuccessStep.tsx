


interface Props {
  onBackToLogin: () => void;
}

export default function SuccessStep({ onBackToLogin }: Props) {
  return (
    <div className="success-step">
      <div className="success-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </div>

      <span className="auth-eyebrow">VERIFICATION COMPLETE</span>

      <h2>Phone verified</h2>

      <p className="success-description">
        The code was accepted in this prototype. No real SMS
        verification or account login occurred.
      </p>

      <button
        type="button"
        onClick={onBackToLogin}
        className="send-code-button success-primary-button"
      >
        <span>Back to login</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="success-secondary-button"
      >
        Use another phone number
      </button>
    </div>
  );
}
