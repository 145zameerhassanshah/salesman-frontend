import ProductsTable from "@/pages/product/allProducts"

const products = [
{
name:"SS-40L Super Series Electric Geyser (800W/1200W/2000W)",
sku:"143434235",
size:"2ft",
category:"Heaters",
selling:"$199.00",
cost:"$125.00",
status:"Active"
},
{
name:"SS-40L Super Series Electric Geyser",
sku:"143434235",
size:"2ft",
category:"Heaters",
selling:"$199.00",
cost:"$125.00",
status:"Low Stock"
}
]

export default function Page(){

return(

<div className="p-8">

<h1 className="text-3xl font-bold mb-6">
Products
</h1>
<ProductsTable products={products}/>
</div>

)

}