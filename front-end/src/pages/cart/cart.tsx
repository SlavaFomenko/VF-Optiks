import { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { addToCart } from '../../api/cartAPI'
import UserContext from '../../context/userContext'
import styles from './cart.module.scss'
import CartCard from '../../components/cart-card/cart-card'


interface Order {
  id: number
  customer_id: number
  customerLogin: string
  status: string
  address: string | null
  deliveryType: string | null
  createOrderDate: string
  totalPrice: number
  cart: CartItem[]
}

interface CartItem {
  name: string
  price: number
  quantity: number
  id_product: number
}

interface CartPageProps {
  product_id?: number
  quantity?:number
}

const CartPage = ({ product_id }: CartPageProps): JSX.Element | null => {
  const [cart, setCart] = useState<Order | null>(null)
  const user = useContext(UserContext)
  const cartElem = document.getElementById('cart')
  
  // console.log(user)
  
  useEffect(() => {
    if (user?.user) {
      if (product_id) {
        // console.log('hello');
        addToCart(user.user.customer_id, user.user.login, product_id, 1).then(res => {
          if (typeof res !== 'number') {
            // console.log(res);
            setCart(res[0])
          } else {
            console.log(res)
          }
        })
      }
    }
  }, [])

  // console.log('hello');
  // if (!cart) {
  //   console.log('hello');
    
  //   return (<main className={styles.wrapper}>
  //   <h1>Корзина</h1>
  //   <ul>
  //     {/* {cart.cart.map(product => (
  //       <CartCard key={product.id_product} product_id={product.id_product} quantity={product.quantity} />
  //     ))} */}
  //   </ul>
  // </main>) // или что-то еще, если корзина пуста
  // }

  // Создайте контейнер для содержимого корзины
  const cartContent = (
    <main className={styles.wrapper}>
      <h1>Корзина</h1>
      <ul>
        {cart ? cart.cart.map(product => (
          <CartCard key={product.id_product} product_id={product.id_product} quantity={product.quantity} />
        )):<></>}
      </ul>
    </main>
  );

  return createPortal(cartContent, cartElem!);
}

export default CartPage
