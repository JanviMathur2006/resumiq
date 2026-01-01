import PageTransition from "../components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Page Title */}
        <h1 className="text-3xl font-semibold">All Resumes</h1>

        {/* Subtitle */}
        <p className="text-gray-600">
          Manage, edit, and create your resumes here.
        </p>

        {/* Action Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          
          {/* Create Resume Card */}
          <div className="p-6 border rounded-lg hover:shadow transition cursor-pointer bg-white">
            <h3 className="text-lg font-semibold mb-2">Create New Resume</h3>
            <p className="text-gray-500">
              Start building a new professional resume.
            </p>
          </div>

          {/* Example Resume Card */}
          <div className="p-6 border rounded-lg hover:shadow transition cursor-pointer bg-white">
            <h3 className="text-lg font-semibold mb-2">My Resume</h3>
            <p className="text-gray-500">
              View or edit your existing resume.
            </p>
          </div>

          {/* Placeholder */}
          <div className="p-6 border rounded-lg hover:shadow transition cursor-pointer bg-white">
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-gray-500">
              More features are on the way.
            </p>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
