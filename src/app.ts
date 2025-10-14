import express from 'express';
import api_routes from './routes/api.routes';
import client_routes from './routes/client/client.index';

const app = express();
app.use(express.json());

app.get('/',(_req,res)=>{
    console.log('/');
    return res.json({
        mensaje:        '👋 Bienvenido a GaliFlower',
        descripcion:    'Sistema administración de proyectos',
        version:        '0.0.1',
        estado:         '✅ activo'
    });
});

app.use('/api/v1', api_routes);
app.use('/api/v0.1/client', client_routes);

app.use((_req,res)=>{
    console.log('/404');
    return res.json({ mensaje: ' Respuesta 404 '});
});

export default app;