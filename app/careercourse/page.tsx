export const metadata = {
  title: "CareerLit | Project Bright Beginnings",
  description: "Join our CareerLit course for career development",
}

export default function CareerCoursePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center px-6 py-12 max-w-2xl">
        <h1 className="text-5xl font-bold text-indigo-900 mb-6">
          CareerLit
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Join our CareerLit course — a program designed to help you explore career paths, 
          build professional skills, and prepare for your future.
        </p>
        <div className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold">
          Coming Soon
        </div>
      </div>
    </main>
  )
}
