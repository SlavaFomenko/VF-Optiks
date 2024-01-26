import { useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'

import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import * as Yup from 'yup'
import { closeCart } from '../../actions/cartActions'
import { closeOrderDetails } from '../../actions/orderDetails'
import UserContext from '../../context/userContext'
import styles from './orderDetails.module.scss'
import { DELIVERY_TYPES } from '../../api/deliveryTypes'
import { CreateOrder } from '../../api/createOrderAPI'

const OrderDetailsPage = (): JSX.Element | null => {
  // const [cart, setCart] = useState<Order | null>(null)
  const { order_id } = useSelector((state: any) => state.order_details.order_details) //переробити типізацію
  const dispatch = useDispatch()
  const navigator = useNavigate()
  const user = useContext(UserContext)
  const cartElem = document.getElementsByTagName('body')[0]

  useEffect(() => {
    if (user?.user) {
      dispatch(closeCart())
      // getCart
    } else {
      dispatch(closeCart())
      navigator('/login')
    }
  }, [])
  const formik = useFormik({
    initialValues: {
      city: '',
      house: '',
      street: '',
      zip_code: '',
      deliveryType: '',
    },
    validationSchema: Yup.object({
      city: Yup.string().required('City is required'),
      house: Yup.string().required('House is required'),
      street: Yup.string().required('street is required'),
      zip_code: Yup.string().required('Zip Code is required'),
      deliveryType: Yup.string().required('Delivery Type is required'),
    }),
    onSubmit: ({street,house,city,zip_code,deliveryType}) => {
      // Handle form submission logic here
      CreateOrder('token',order_id,Number(deliveryType),{street,house,city,zip_code})
      .then(res=>{
        dispatch(closeOrderDetails())
      })
      // console.log(values)
    }
  })
  // console.log(cart);

  const cartContent = (
    <main className={styles.wrapper}>
      <button className={styles.close_btn} onClick={() => dispatch(closeOrderDetails())}></button>
      <div className={styles.title}>
        <h1>Деталі замовлення</h1>
        <span className={styles.total_price}>Номер замовлення {order_id}.</span>
      </div>
      <div className={styles.product_list}>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor='city'>City</label>
            <input
              type='text'
              id='city'
              name='city'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.city}
            />
            {formik.touched.city && formik.errors.city && <div>{formik.errors.city}</div>}
          </div>

          <div>
            <label htmlFor='house'>House</label>
            <input
              type='text'
              id='house'
              name='house'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.house}
            />
            {formik.touched.house && formik.errors.house && <div>{formik.errors.house}</div>}
          </div>

          <div>
            <label htmlFor='street'>street</label>
            <input
              type='text'
              id='street'
              name='street'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.street}
            />
            {formik.touched.street && formik.errors.street && <div>{formik.errors.street}</div>}
          </div>

          <div>
            <label htmlFor='zip_code'>Zip Code</label>
            <input
              type='text'
              id='zip_code'
              name='zip_code'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.zip_code}
            />
            {formik.touched.zip_code && formik.errors.zip_code && <div>{formik.errors.zip_code}</div>}
          </div>

          <div>
            <label htmlFor='deliveryType'>Delivery Type</label>
            <select
              id='deliveryType'
              name='deliveryType'
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.deliveryType}
            >
              <option value='' label='Select a delivery type' />
              {Object.entries(DELIVERY_TYPES).map(([value, label]) => (
                <option key={value} value={value} label={label} />
              ))}
            </select>
            {formik.touched.deliveryType && formik.errors.deliveryType && <div>{formik.errors.deliveryType}</div>}
          </div>

          <button type='submit'>Оформити замовлення</button>
        </form>
        
      </div>
    </main>
  )
  return createPortal(cartContent, cartElem!)
}

export default OrderDetailsPage
