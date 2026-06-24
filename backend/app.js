require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const flagRoutes = require('./routes/featureFlag');
const orgRoutes = require('./routes/organization');

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const path = require('path');

app.use('/super_admin', express.static(path.join(__dirname, '../frontend/super_admin')));
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));
app.use('/user', express.static(path.join(__dirname, '../frontend/user')));

app.get('/', (req, res) => res.send('Server Initialized'));

app.use('/auth', authRoutes);
app.use('/org', orgRoutes);
app.use('/flags', flagRoutes);

app.listen(3000, () => console.log('Server runs at http://localhost:3000'));