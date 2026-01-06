import React, { forwardRef } from "react";

const ResumePDF = forwardRef(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[800px] bg-white text-black p-10"
    >
      <h1 className="text-3xl font-bold mb-4">
        Your Name
      </h1>

      {/* SUMMARY */}
      {data.summary && (
        <Section title="Professional Summary">
          <p>{data.summary}</p>
        </Section>
      )}

      {/* EXPERIENCE */}
      {data.experience && (
        <Section title="Experience">
          <p>{data.experience}</p>
        </Section>
      )}

      {/* PROJECTS */}
      {data.projects && (
        <Section title="Projects">
          <p>{data.projects}</p>
        </Section>
      )}

      {/* EDUCATION */}
      {data.education && (
        <Section title="Education">
          <p>{data.education}</p>
        </Section>
      )}

      {/* SKILLS */}
      {data.skills && (
        <Section title="Skills">
          <p>{data.skills}</p>
        </Section>
      )}
    </div>
  );
});

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default ResumePDF;
