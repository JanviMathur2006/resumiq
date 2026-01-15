import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const finishOnboarding = () => {
    const onboardingData = {
      role,
      goal,
      onboardingCompleted: true,
    };

    localStorage.setItem(
      "onboarding",
      JSON.stringify(onboardingData)
    );

    navigate("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-10">

        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-10 text-sm text-slate-400">
          <span className={step >= 1 ? "text-blue-600 font-medium" : ""}>
            Step 1
          </span>
          <span className={step >= 2 ? "text-blue-600 font-medium" : ""}>
            Step 2
          </span>
          <span className={step >= 3 ? "text-blue-600 font-medium" : ""}>
            Done
          </span>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Who are you?
            </h2>
            <p className="text-slate-500 mb-8">
              This helps us personalize your resume
            </p>

            <div className="grid gap-4">
              {["Student", "Fresher", "Professional"].map((item) => (
                <button
                  key={item}
                  onClick={() => setRole(item)}
                  className={`p-4 rounded-xl border text-left transition
                    ${
                      role === item
                        ? "border-blue-600 bg-blue-50"
                        : "hover:border-slate-300"
                    }`}
                >
                  <h3 className="font-medium">{item}</h3>
                </button>
              ))}
            </div>

            <button
              disabled={!role}
              onClick={nextStep}
              className="mt-10 w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              What’s your goal?
            </h2>
            <p className="text-slate-500 mb-8">
              Choose what you’re aiming for
            </p>

            <div className="grid gap-4">
              {["Internship", "Job", "Career Switch"].map((item) => (
                <button
                  key={item}
                  onClick={() => setGoal(item)}
                  className={`p-4 rounded-xl border text-left transition
                    ${
                      goal === item
                        ? "border-blue-600 bg-blue-50"
                        : "hover:border-slate-300"
                    }`}
                >
                  <h3 className="font-medium">{item}</h3>
                </button>
              ))}
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={prevStep}
                className="w-1/2 border py-3 rounded-xl"
              >
                Back
              </button>
              <button
                disabled={!goal}
                onClick={nextStep}
                className="w-1/2 bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3">
              You’re all set 🎉
            </h2>
            <p className="text-slate-500 mb-8">
              We’ll tailor Resumiq for you
            </p>

            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm">
              <p>
                <strong>Role:</strong> {role}
              </p>
              <p>
                <strong>Goal:</strong> {goal}
              </p>
            </div>

            <button
              onClick={finishOnboarding}
              className="w-full bg-blue-600 text-white py-3 rounded-xl"
            >
              Start building my resume
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
