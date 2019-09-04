import { suite, test } from 'mocha-typescript';
import { Container } from 'typedi';
import { createReadStream } from 'fs';
import { TempPathsRegistry, ContextUtil, ActionSnapshot } from 'fbl';
import { strictEqual } from 'assert';
import { ImageRenderActionHandler } from '../../../src/handlers';

const PNG = require('pngjs').PNG;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

@suite()
class ImageRenderActionHandlerTestSuite {
    async after(): Promise<void> {
        const tempPathRegistry = Container.get(TempPathsRegistry);
        await tempPathRegistry.cleanup();

        Container.reset();
    }

    @test()
    async failValidation() {
        const actionHandler = new ImageRenderActionHandler();
        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0, {});

        await chai.expect(actionHandler.getProcessor([], context, snapshot, {}).validate()).to.be.rejected;
        await chai.expect(actionHandler.getProcessor({}, context, snapshot, {}).validate()).to.be.rejected;
        await chai.expect(actionHandler.getProcessor('yes', context, snapshot, {}).validate()).to.be.rejected;

        await chai.expect(
            actionHandler
                .getProcessor(
                    {
                        from: {},
                        img: {},
                    },
                    context,
                    snapshot,
                    {},
                )
                .validate(),
        ).to.be.rejected;

        await chai.expect(
            actionHandler
                .getProcessor(
                    {
                        from: {},
                        img: {},
                    },
                    context,
                    snapshot,
                    {},
                )
                .validate(),
        ).to.be.rejected;

        await chai.expect(
            actionHandler
                .getProcessor(
                    {
                        from: {
                            folder: '',
                        },
                        img: {},
                    },
                    context,
                    snapshot,
                    {},
                )
                .validate(),
        ).to.be.rejected;

        await chai.expect(
            actionHandler
                .getProcessor(
                    {
                        from: {
                            folder: '',
                            relativePath: 'index.html',
                        },
                        img: {},
                    },
                    context,
                    snapshot,
                    {},
                )
                .validate(),
        ).to.be.rejected;

        await chai.expect(
            actionHandler
                .getProcessor(
                    {
                        from: {
                            folder: '',
                            relativePath: 'index.html',
                        },
                        img: {},
                    },
                    context,
                    snapshot,
                    {},
                )
                .validate(),
        ).to.be.rejected;
    }

    @test()
    async passValidation() {
        const actionHandler = new ImageRenderActionHandler();
        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('.', {}, '', 0, {});

        await actionHandler
            .getProcessor(
                {
                    viewport: {
                        height: 1,
                        width: 1,
                    },
                    from: {
                        folder: 'test',
                        relativePath: 'index.html',
                    },
                    img: {
                        path: 'test.png',
                    },
                },
                context,
                snapshot,
                {},
            )
            .validate();
    }

    @test()
    async generatePngFile() {
        const tempPathRegistry = Container.get(TempPathsRegistry);
        const imgPath = await tempPathRegistry.createTempFile();

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('id', {}, process.cwd(), 0, {});

        const actionHandler = new ImageRenderActionHandler();
        const processor = actionHandler.getProcessor(
            {
                viewport: {
                    height: 1,
                    width: 1,
                },
                from: {
                    folder: 'test/assets',
                    relativePath: 'index.html',
                },
                img: {
                    path: imgPath,
                },
            },
            context,
            snapshot,
            {},
        );

        await processor.validate();
        await processor.execute();

        const color = await this.readImage(imgPath);
        strictEqual(color, 'rgb(255,0,0):1x1');
    }

    @test()
    async generateImgWithTimeout() {
        const tempPathRegistry = Container.get(TempPathsRegistry);
        const imgPath = await tempPathRegistry.createTempFile();

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('id', {}, process.cwd(), 0, {});

        const actionHandler = new ImageRenderActionHandler();
        const processor = actionHandler.getProcessor(
            {
                timeout: 5,
                readyFunction: 'readyFunction',
                from: {
                    folder: 'test/assets',
                    relativePath: 'index.html',
                },
                img: {
                    path: imgPath,
                },
            },
            context,
            snapshot,
            {},
        );

        await processor.validate();

        await chai.expect(processor.execute()).to.be.rejectedWith('Timeout waiting for ready function call');
    }

    @test()
    async generateImgWithReadyFunctionSetting() {
        const tempPathRegistry = Container.get(TempPathsRegistry);
        const imgPath = await tempPathRegistry.createTempFile();

        const context = ContextUtil.generateEmptyContext();
        const snapshot = new ActionSnapshot('id', {}, process.cwd(), 0, {});

        const actionHandler = new ImageRenderActionHandler();
        const processor = actionHandler.getProcessor(
            {
                timeout: 5,
                readyFunction: 'iAmReady',
                viewport: {
                    height: 1,
                    width: 1,
                },
                from: {
                    folder: 'test/assets',
                    relativePath: 'readyFn.html',
                },
                img: {
                    path: imgPath,
                },
            },
            context,
            snapshot,
            {},
        );

        await processor.validate();
        await processor.execute();

        const color = await this.readImage(imgPath);
        strictEqual(color, 'rgb(255,0,0):1x1');
    }

    private async readImage(imgPath: string): Promise<string> {
        return await new Promise<string>((res, rej) => {
            createReadStream(imgPath)
                .pipe(new PNG())
                .on('error', (err: Error) => {
                    return rej(err);
                })
                .on('parsed', function() {
                    res(`rgb(${this.data[0]},${this.data[1]},${this.data[2]}):${this.width}x${this.height}`);
                });
        });
    }
}
