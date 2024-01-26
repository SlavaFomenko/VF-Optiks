const express = require('express');
const path = require('path');
const fs = require('fs');

const categoryRoutes = require('./routes/category')
const customerRoutes = require('./routes/customer')
const customersLoginRoutes = require('./routes/customersLogin')
const manufacturersRoutes = require('./routes/manufacturers')
const statusRoutes = require('./routes/statuses')
const productsRoutes = require('./routes/products')
const ordersRoutes = require('./routes/orders')
const statisticRoutes = require('./routes/statistic')
const cors = require('cors')


const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.json())
app.use(cors())




app.use('/customers/login',customersLoginRoutes);
app.use('/customers',customerRoutes);

app.use('/manufacturers',manufacturersRoutes)

app.use('/categories',categoryRoutes);

app.use('/statuses',statusRoutes)

app.use('/products',productsRoutes)

app.use('/orders',ordersRoutes)

app.use('/statistic',statisticRoutes)

app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
  
    if (fs.existsSync(imagePath)) {
    
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  });


app.use((req, res) => {
    res.status(404).json({ error: 'end-point not found' });
});

app.listen(PORT, () => {
    console.log(`Сервер слушает порт ${PORT}`);
});
