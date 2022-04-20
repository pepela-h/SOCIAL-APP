const allowedOrigins = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:3500/",
  "http://localhost:3500/"
];

const corsOptions = {
  origin: (origin, callback) => {

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      
      callback(null, true);

    } else {
      callback(new Error("Blocked by CORS policy"));

    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = corsOptions;
