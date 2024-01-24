import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import { getProduct } from '../../api/productAPI'
import defaultImg from '../../images/header/eye_logo.png'
import { extractProductIdFromUrl } from '../../utils/scripts/extractProductIdFromUrl'
import CartPage from '../cart/cart'
import styles from './product.module.scss'
import { useDispatch } from 'react-redux'
import { openCart } from '../../actions/cartActions'

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

const ProductPage = (): JSX.Element => {
  const [product, setProduct] = useState<Product | undefined>(undefined)
  // const [cartIsOpen, setCartIsOpen] = useState<boolean>(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const productId = extractProductIdFromUrl()
    if (productId) {
      getProduct(1, 5, '', productId).then(res => {
        if (typeof res !== 'number') {
          setProduct(res[0])
        }
      })
    }
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    autoplay: true,
    speed: 700,
    cssEase: 'linear',
    asessability: false,
    adaptiveHeight: false,
    arrows: false,
    centerPadding: '0px',
    touchMove: true,
    className: styles.slider_settings,
  }
  // console.log(product)

  return (
    <main className={styles.main}>
      {product ? (
        <div className={styles.wrapper}>
          <div className={styles.info}>
            <h3>Характеристики</h3>
            <ul>
              <li>Стать :</li>
              <li>{product.gender}</li>
              <li>Країна :</li>
              <li>{product.country}</li>
              <li>Виробник :</li>
              <li>{product.manufacturer}</li>
              <li>Категорія :</li>
              <li>{product.category}</li>
            </ul>
          </div>
          <div className={styles.product}>
            <h1>{product.name}</h1>
            <div className={styles.slider}>
              <Slider {...settings}>
                {product.images.length !== 0 ? (
                  product.images.map(img => (
                    <div key={img.image_id}>
                      <img src={img.image_url} alt={`${img.image_id}`} />
                    </div>
                  ))
                ) : (
                  <div>
                    <img className={styles.defaultImg} src={defaultImg} alt='defaultImg' />
                  </div>
                )}
              </Slider>
            </div>
          </div>
          <div className={styles.add_to_cart}>
            <div className={styles.price_info}>
              <span className={styles.price}>{product.price} грн</span>
              <span className={styles.quantity}>В наявності {product.quantity}</span>
            </div>
            <div className={styles.add_to_cart_button}>
              <button onClick={()=>dispatch(openCart({ product_id: product.id, quantity: 1 }))}> Додати до кошика </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* {cartIsOpen ? <CartPage product_id={product?.id} /> : <></>} */}
    </main>
  )
}

export default ProductPage
