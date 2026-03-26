import CategoryBasicInfo from "@/app/components/categories/CategoryBasicInfo";
import CategoryHeader from "@/app/components/categories/CategoryHeader";
import CategoryItems from "@/app/components/categories/CategoryItems";
import CategoryStatus from "@/app/components/categories/CategoryStatus";
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