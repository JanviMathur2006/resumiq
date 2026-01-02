import PageTransition from "../components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            All Resumes
          </h1>
          <p className="text-gray-600 text-lg">
            Manage, edit, and create your resumes effortlessly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Create Resume */}
          <div className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              Create New Resume
            </h3>
            <p className="text-gray-500">
              Start building a professional resume in minutes.
            </p>
          </div>

          {/* My Resume */}
          <div className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
              My Resume
            </h3>
            <p className="text-gray-500">
              View, edit or download your saved resumes.
            </p>
          </div>

          {/* Coming Soon */}
          <div className="group cursor-not-allowed rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-400">
              Coming Soon
            </h3>
            <p className="text-gray-400">
              More powerful features are on the way.
            </p>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
