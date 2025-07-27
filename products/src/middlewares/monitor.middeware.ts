import { NextFunction, Request, Response } from "express";
import client from 'prom-client';

const collectDefaultMetrics: any = client.collectDefaultMetrics;

collectDefaultMetrics({ timeout: 5000 });

const counter = new client.Counter({
    name: 'http_requests_total',
    help: 'Cantidad total de solicitudes HTTP',
    labelNames: ['method', 'status_code'],
});


function monitor(req: Request, res: any, next: NextFunction): void {
    res.on('finish', () => {
        counter.labels(req.method, res.statusCode).inc();
    });
    next();
}

export default monitor