import Image from "next/image";
import CameraCapture from "@/components/CameraCapture";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 text-center space-y-6">
      <h1 className="text-3xl font-bold">Face Collect</h1>
      <p className="text-gray-600">
        Capture your face and provide details securely.
      </p>

      <CameraCapture />

      <form className="flex flex-col space-y-4 w-full max-w-sm text-left">
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Name</span>
          <input
            type="text"
            className="border rounded p-2"
            required
            placeholder="Enter your name"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Age (optional)</span>
          <input
            type="number"
            className="border rounded p-2"
            placeholder="Enter age"
          />
        </label>

        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Gender (optional)</span>
          <select className="border rounded p-2">
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
            <option>Prefer not to say</option>
          </select>
        </label>

        <label className="flex items-center space-x-2">
          <input type="checkbox" required />
          <span className="text-sm">
            I consent to my data being collected for face recognition research.
          </span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
