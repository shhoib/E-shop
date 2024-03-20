import Container from "@/app/components/Container"
import ProductDetails from "./productDetails"
import { product } from "@/utils/product"
import ListRating from "./ListRating"

interface IParams {
    productId? : string
}
const Product = ({params}:{params:IParams}) => {

  return (
    <div className="p-8">
    <Container>
        <ProductDetails product={product}/>
        <div className="flex flex-col mt-20 gap-4">
          <div>Add rating</div>
          <ListRating product={product}/>
        </div>
    </Container>
    </div>
  )
}

export default Product