"use client";

import { useState } from "react";

export default function BusinessDetail() {

  const [showDirectorForm, setShowDirectorForm] = useState(false);

  const roles = {
    directors: ["John Doe"],
    admins: ["Admin 1"],
    salesman: ["Sales 1"],
    dispatcher: ["Dispatcher 1"],
    accountants: ["Accountant 1"]
  };

  return (

    <div className="p-8 bg-white min-h-screen text-black">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-bold">
          Industry Management
        </h1>

        <button
          onClick={() => setShowDirectorForm(true)}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Add Director
        </button>

      </div>

      {/* ROLES */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <RoleCard title="Directors/Admins" data={roles.directors} />
        <RoleCard title="Salesman" data={roles.salesman} />
        <RoleCard title="Dispatcher" data={roles.dispatcher} />
        <RoleCard title="Accountants" data={roles.accountants} />

      </div>


      {/* DIRECTOR FORM */}

      {showDirectorForm && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-[500px]">

            <h2 className="text-xl font-bold mb-6">
              Add Director
            </h2>

            <form className="space-y-4">

              <input placeholder="Name" className="border p-2 w-full"/>
              <input placeholder="Email" className="border p-2 w-full"/>
              <input placeholder="Phone" className="border p-2 w-full"/>

              <button className="bg-black text-white px-6 py-2 rounded-lg">
                Add Director
              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}


function RoleCard({ title, data }: any) {

  return (

    <div className="border border-black p-6 rounded-xl">

      <h3 className="font-bold mb-4">
        {title}
      </h3>

      {data.map((d: string, i: number) => (
        <p key={i}>{d}</p>
      ))}

    </div>

  );
}