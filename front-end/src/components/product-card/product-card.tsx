import { Link } from 'react-router-dom'
import defaultImg from '../../images/header/eye_logo.png'
import styles from './product-card.module.scss'

interface Image {
  image_id: number
  image_url: string
}

type Gender = 'Чоловічі' | 'Жіночі' | 'Унісекс'

interface Product {
  id: number
  name: string
  category: string
  gender: Gender
  manufacturer: string
  country: string
  price: number
  quantity: number
  images: Image[] | [] // Массив изображений, который может быть пустым
}

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps): JSX.Element => {
  // console.log(product)

  return (
    <li className={styles.wrapper}>
      <div className={styles.card_wrapper}>
        <Link to={`/product/${product.id}`} className={styles.card_content}>
          <div className={styles.card_image}>
            {product.images.length === 0 ? (
              <img src={defaultImg} className={styles.default_img} alt='default img' />
            ) : (
              <img src={product.images[0].image_url} alt='default img' />
            )}
          </div>
          <div className={styles.card_text}>
            <span className={styles.name}>{product.name}</span>
            <span className={styles.manufacturer}>{product.manufacturer}</span>
            <span className={styles.quantity}>{product.quantity}</span>
            <span className={styles.price}>{product.price} грн</span>
          </div>
        </Link>
        <button className={styles.card_button}> Додати до кошика </button>
      </div>
    </li>
  )
}

export default ProductCard
