import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import router from './routes';
import { Morgan } from './shared/morgen';
import webhookHandler from './stripe/webhookHandler';
const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);

//stripe raw

app.use('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);
// const allowedOrigins = [
//       'http://dashboard.mehor.com',
//       'https://dashboard.mehor.com',
//       'https://www.dashboard.mehor.com',
//       'http://www.dashboard.mehor.com',
//       'http://localhost:3000',
//       'http://mehor.com',
//       'https://mehor.com',
//       'http://www.mehor.com',
//       'https://www.mehor.com',
//       'http://168.231.64.178:3000'
// ];
// //body parser
// app.use(
//       cors({
//             origin: function (origin, callback) {
//                   // allow requests with no origin (like mobile apps or curl requests)
//                   if (!origin) return callback(null, true);
//                   if (allowedOrigins.indexOf(origin) === -1) {
//                         const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//                         return callback(new Error(msg), false);
//                   }
//                   return callback(null, true);
//             },
//             credentials: true,
//       })
// );
// app.use(
//       cors({
//             origin: "*",
//             credentials: true,
//       })
// );

app.use(
      cors({
            origin: [
                  'https://mehor.com', 'https://dashboard.mehor.com','http://168.231.64.178:3000','http://168.231.64.178:3001','http://168.231.64.178:4175'
    
            ],
            credentials: true,
      })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
      res.send(`
            <div style="display:flex; justify-content:center; align-items:center; height:100vh;">
                  <div style="text-align:center;">
                        <h1 style="color:#A55FEF; font-family:Arial, Helvetica, sans-serif; font-size:3rem;">Welcome to my API</h1>
                        <p style="color:#777; font-size:1.5rem;">I'm happy to help you with anything you need.</p>
                  </div>
            </div>
      `);
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
      res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: 'Not found',
            errorMessages: [
                  {
                        path: req.originalUrl,
                        message: `The API route ${req.originalUrl} doesn't exist. Please contact the API owner if you need help`,
                  },
            ],
      });
});

export default app;
