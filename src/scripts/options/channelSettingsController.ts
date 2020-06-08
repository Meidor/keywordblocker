import { BlockItemSettingsController } from './blockItemSettingsController';
import { BlockItem, Settings } from './models/settings';
export class ChannelSettingsController extends BlockItemSettingsController {
    private settings: Settings;

    constructor(settings: Settings) {
        super();
        this.settings = settings;
    }

    public async initialize(): Promise<void> {
        this.displayChannels();
    }

    private displayChannels(): void {
        this.displayBlockItems(this.settings.channels, document.getElementById('channels'), 'channel-input', 'Channel');
        this.watchChannels();
    }

    private watchChannels(): void {
        this.watchAddChannel();
        this.watchRemoveChannel();
        this.watchBlockPartialChannel();
    }

    private watchAddChannel(): void {
        const addChannel = async (): Promise<void> => {
            const input: HTMLInputElement = document.querySelector('#channel-input .keyword');
            const blockPartial: HTMLInputElement = document.querySelector('#channel-input .block-partial');
            const channel = input.value;
            const channelArray = this.settings.channels.map((x) => x.keyword);
            if (input.value.length > 0 && channelArray.indexOf(channel) === -1) {
                this.settings.channels.push(new BlockItem(channel, blockPartial.checked));
                await this.settings.save();
                this.displayChannels();
            }
        };

        const button: HTMLElement = document.querySelector('#channel-input .button');
        const row: HTMLElement = document.querySelector('#channel-input');
        this.watchAddBlockItem(row, button, addChannel);
    }

    private watchRemoveChannel(): void {
        const removeButtons = document.querySelectorAll('#channels .keyword-row .button');
        const removeChannel = async (index: number): Promise<void> => {
            this.settings.channels.splice(index, 1);
            await this.settings.save();
            this.displayChannels();
        };
        this.watchRemoveBlockItem(removeButtons, removeChannel);
    }

    private watchBlockPartialChannel(): void {
        const blockPartialCheckboxes = document.querySelectorAll('#channels .keyword-row .block-partial');
        const toggleBlockPartial = async (checkbox: HTMLInputElement): Promise<void> => {
            const status = checkbox.checked;
            const indexElement = checkbox.closest('.keyword-row') as HTMLElement;
            const index = parseInt(indexElement.dataset.index, 10);
            this.settings.channels[index].blockPartialMatch = status;
            await this.settings.save();
            this.displayChannels();
        };
        this.watchBlockPartialBlockItem(blockPartialCheckboxes, toggleBlockPartial);
    }
}
