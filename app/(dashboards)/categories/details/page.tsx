import CategoryBasicInfo from "@/pages/categories/CategoryBasicInfo";
import CategoryHeader from "@/pages/categories/CategoryHeader";
import CategoryItems from "@/pages/categories/CategoryItems";
import CategoryStatus from "@/pages/categories/CategoryStatus";
export default function Page() {

return (

<div className="flex flex-col gap-6">

<CategoryHeader />

<CategoryBasicInfo />

<CategoryItems />

<CategoryStatus />

</div>

)

}