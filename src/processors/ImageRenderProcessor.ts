const portfinder = require('portfinder');
import * as express from 'express';
import { Server } from 'http';
import { launch, ScreenshotOptions } from 'puppeteer';
import { ActionSnapshot, ActionError } from 'fbl';

export class ImageRenderProcessor {
    private server: Server;
    private port: number;

    constructor(
        private targetFolder: string,
        private relativePath: string,
        private imgOptions: ScreenshotOptions,
        private snapshot: ActionSnapshot,
        private options: {
            viewport?: {
                width?: number;
                height?: number;
                deviceScaleFactor?: number;
                isMobile?: boolean;
                isLandscape?: boolean;
            };
            timeout?: number;
            readyFunction?: string;
        },
    ) {}

    public async run(): Promise<void> {
        await this.startServer();
        await this.render();
        await this.closeServer();
    }

    private async render(): Promise<void> {
        this.snapshot.log('-> launching browser');
        const browser = await launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: this.options.viewport,
        });
        this.snapshot.log('-> openning new page');
        const page = await browser.newPage();
        this.snapshot.log(`-> navigating to: http://localhost:${this.port}/${this.relativePath}`);

        page.on('pageerror', (err: Error) => {
            this.snapshot.log(`Page error occurred. ${err.toString()} ${err.stack}`, true);
        });

        let timeout = ((this.options.hasOwnProperty('timeout') && this.options.timeout) || 30) * 1000;
        const start = Date.now();

        await page.goto(`http://localhost:${this.port}/${this.relativePath}`, {
            waitUntil: 'networkidle0',
            timeout,
        });

        // calculate remaining timeout
        timeout = timeout - (Date.now() - start);

        if (this.options.readyFunction) {
            let resolve: Function;
            let timer: NodeJS.Timeout;

            const blockPromise = new Promise<void>((res, rej) => {
                timer = setTimeout(() => {
                    rej(new ActionError('Timeout waiting for ready function call', 'TIMEOUT'));
                }, timeout);

                resolve = () => {
                    clearTimeout(timer);
                    res();
                };
            });

            await page.exposeFunction(this.options.readyFunction, () => {
                this.snapshot.log('-> ready function called');
                resolve();
            });

            await blockPromise;
        }

        this.snapshot.log('-> rendering image');
        await page.screenshot(this.imgOptions);
        this.snapshot.log('-> closing browser');
        await browser.close();
        this.snapshot.log('<- browser closed');
    }

    private async startServer(): Promise<void> {
        const port = (this.port = await portfinder.getPortPromise());

        const app = express();
        app.use(express.static(this.targetFolder));

        this.snapshot.log(`-> starting server on port: ${port}`);
        await new Promise<void>((res) => {
            this.server = app.listen(port, res);
        });
        this.snapshot.log('<- server started');
    }

    private async closeServer(): Promise<void> {
        this.snapshot.log('-> closing server');
        this.server.close();
        this.snapshot.log('<- server closed');
    }
}
