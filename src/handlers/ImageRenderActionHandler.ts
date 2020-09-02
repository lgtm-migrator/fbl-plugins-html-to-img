import {
    ActionHandler,
    ActionProcessor,
    ActionSnapshot,
    IActionHandlerMetadata,
    IDelegatedParameters,
    IContext,
    FSUtil,
} from 'fbl';

import * as Joi from 'joi';
import { ImageRenderProcessor } from '../processors';

export class ImageRenderActionProcessor extends ActionProcessor {
    private static schema = Joi.object()
        .keys({
            timeout: Joi.number().min(1).max(3600),

            readyFunction: Joi.string().min(1),

            viewport: Joi.object({
                width: Joi.number().integer().min(1),
                height: Joi.number().integer().min(1),
                deviceScaleFactor: Joi.number().min(0),
                isMobile: Joi.boolean(),
                isLandscape: Joi.boolean(),
            }).options({
                abortEarly: true,
                allowUnknown: false,
            }),

            from: Joi.object({
                folder: Joi.string().required().min(1),
                relativePath: Joi.string().required().min(1),
            })
                .required()
                .options({
                    abortEarly: true,
                    allowUnknown: false,
                }),

            img: Joi.object({
                path: Joi.string().required().min(1),

                type: Joi.string().allow('jpeg', 'png').default('png'),
                quality: Joi.number().min(0).max(100),

                fullPage: Joi.boolean(),

                clip: Joi.object({
                    x: Joi.number().required(),
                    y: Joi.number().required(),
                    width: Joi.number().required().min(0),
                    height: Joi.number().required().min(0),
                }).options({
                    abortEarly: true,
                    allowUnknown: false,
                }),

                omitBackground: Joi.boolean(),

                encoding: Joi.string().allow('base64', 'binary').default('binary'),
            })
                .required()
                .options({
                    abortEarly: true,
                    allowUnknown: false,
                }),
        })
        .required()
        .options({
            abortEarly: true,
            allowUnknown: false,
        });

    /**
     * @inheritdoc
     */
    getValidationSchema(): Joi.Schema {
        return ImageRenderActionProcessor.schema;
    }

    /**
     * @inheritdoc
     */
    async execute(): Promise<void> {
        const to = JSON.parse(JSON.stringify(this.options.img));
        to.path = FSUtil.getAbsolutePath(to.path, this.snapshot.wd);

        to.type = to.type || 'png';
        to.encoding = to.encoding || 'binary';

        const processor = new ImageRenderProcessor(
            FSUtil.getAbsolutePath(this.options.from.folder, this.snapshot.wd),
            this.options.from.relativePath,
            to,
            this.snapshot,
            {
                viewport: this.options.viewport,
                timeout: this.options.timeout,
                readyFunction: this.options.readyFunction,
            },
        );

        await processor.run();
    }
}

export class ImageRenderActionHandler extends ActionHandler {
    private static metadata = <IActionHandlerMetadata>{
        id: 'com.fireblink.fbl.plugins.html.to.img',
        aliases: ['fbl.plugins.html.to.img', 'html.to.img', 'html->img'],
    };

    /* istanbul ignore next */
    /**
     * @inheritdoc
     */
    getMetadata(): IActionHandlerMetadata {
        return ImageRenderActionHandler.metadata;
    }

    /**
     * @inheritdoc
     */
    getProcessor(
        options: any,
        context: IContext,
        snapshot: ActionSnapshot,
        parameters: IDelegatedParameters,
    ): ActionProcessor {
        return new ImageRenderActionProcessor(options, context, snapshot, parameters);
    }
}
