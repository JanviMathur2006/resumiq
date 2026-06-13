import React, { forwardRef } from "react";

const ResumePDF = forwardRef(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[800px] bg-white text-black px-10 py-8 text-sm leading-relaxed"
    >
      {/* HEADER */}
      <h1 className="text-3xl font-bold uppercase">
        {data.name || "YOUR NAME"}
      </h1>

      <div className="mt-2 text-sm">
        {data.phone} | {data.email} | {data.github} | {data.linkedin}
      </div>

      {/* PROFILE */}
      <Section title="PROFILE">
        <p>{data.summary}</p>
      </Section>

      {/* PROJECTS */}
      <Section title="PROJECTS">
        <p>{data.projects}</p>
      </Section>

      {/* TECHNICAL SKILLS */}
      <Section title="TECHNICAL SKILLS">
        <p>{data.skills}</p>
      </Section>

      {/* EDUCATION */}
      <Section title="EDUCATION">
        <p>{data.education}</p>
      </Section>
    </div>
  );
});

function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="font-bold uppercase border-b border-black pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

export default ResumePDF;