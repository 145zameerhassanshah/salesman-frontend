// "use client";
// import { useSelector } from "react-redux";

// export default function SalesmanHeader() {
//   const user = useSelector((state: any) => state.user.user);

//   return (
//     <div className="flex items-center justify-between mb-8">
//       <div>
//         <p className="text-sm text-gray-400">
//           {user?.user_type.toUpperCase()} ›
//         </p>

//         <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
//       </div>

//       <button className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
//         Add Order
//       </button>
//       <button className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm">
//         Add Quotation
//       </button>
//     </div>
//   );
// }


"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function SalesmanHeader() {
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <p className="text-sm text-gray-400">
          {user?.user_type?.toUpperCase()} ›
        </p>

        <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/orders/add")}
          className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
        >
          Add Order
        </button>

        <button
          type="button"
          onClick={() => router.push("/quotations/add")}
          className="bg-black text-white flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
        >
          Add Quotation
        </button>
      </div>
    </div>
  );
}