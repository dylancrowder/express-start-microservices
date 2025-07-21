import cors from "cors";
import helmet from "helmet";

const corsOptions = {
  /*   origin: [
    "http://localhost:4000",
    "http://localhost:8085",
    "http://localhost:8083",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true, */
};

export default [
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://apis.google.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      connectSrc: [
        "'self'",
        "http://localhost:8085",
        "http://localhost:8083",
        "http://localhost:4000",
      ],
      frameAncestors: ["'none'"],
    },
  }),

  cors(corsOptions),
];
