"use client";

export default function SettingsPage() {
  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>

      {/* ================= BRANDING ================= */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">

        <h2 className="font-medium mb-4">Branding & Business Info</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LOGO */}
          <div className="space-y-3">

            <div className="w-28 h-28 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400 text-xs">
              LOGO
            </div>

            <div>
              <p className="text-sm font-medium">Company Logo</p>
              <p className="text-xs text-gray-500">
                Upload PNG/JPG (max 2MB)
              </p>
            </div>

            <button className="bg-black text-white px-3 py-2 rounded-lg text-sm">
              Choose File
            </button>

          </div>

          {/* FORM */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-xs text-gray-500">Company Name</label>
              <input
                defaultValue="Welcome Appliances"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Phone Number</label>
              <input
                defaultValue="+1 (555) 000-0000"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Street Address</label>
              <input
                defaultValue="123 Business Ave, Suite 100"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
              />
            </div>

          </div>

        </div>

      </div>

      {/* ================= INVOICE NUMBERING ================= */}
      <div className="bg-white/60 backdrop-blur rounded-3xl p-4 md:p-6">

        <h2 className="font-medium mb-4">Invoice Numbering</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {/* LEFT FORM */}
          <div className="md:col-span-2 grid md:grid-cols-2 gap-4">

            <div>
              <label className="text-xs text-gray-500">Invoice Prefix</label>
              <input
                defaultValue="INV-"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500">Starting Number</label>
              <input
                defaultValue="1001"
                className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-100 text-sm outline-none"
              />
            </div>

          </div>

          {/* PREVIEW */}
          <div className="bg-gray-100 rounded-2xl p-4 flex flex-col justify-between">

            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-gray-500">Format Preview</p>
              <span className="text-green-600 bg-green-100 text-xs px-2 py-1 rounded">
                Valid Format
              </span>
            </div>

            <h3 className="text-xl font-semibold tracking-wide">
              INV-1001
            </h3>

            <p className="text-xs text-gray-500 mt-2">
              Next invoice will use this format.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}