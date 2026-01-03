export default function ResumePreview({ type }) {
  return (
    <div className="bg-white p-6 shadow rounded min-h-full">
      <h1 className="text-2xl font-bold">Your Name</h1>
      <p className="text-gray-600">Resume Type: {type}</p>

      <hr className="my-4" />

      <p>
        This is a live preview of your resume. You can style it however you
        want.
      </p>
    </div>
  );
}
