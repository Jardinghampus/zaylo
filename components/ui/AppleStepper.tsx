interface Props {
  steps: string[];
  currentStep: number;
}

export function AppleStepper({ steps, currentStep }: Props) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-0.5 bg-[var(--fill-tertiary)] rounded-sm overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-apple-blue rounded-sm transition-all duration-[400ms] ease-apple"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((label, i) => (
          <span
            key={label}
            className={[
              "text-caption1 transition-colors duration-fast",
              i < currentStep
                ? "text-apple-blue"
                : i === currentStep
                ? "text-text-primary font-medium"
                : "text-text-tertiary",
            ].join(" ")}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
