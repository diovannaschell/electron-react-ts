
import 'reflect-metadata'
import { Container } from 'typedi';
import { BrowserWindow } from 'electron';
import { Serial } from './serial/serial';


/**
 * cada AppModule se refere a um modulo lógico do sistema, uma "parte" que contém funcionalidades atrelada a lógica de negócio.
 * Os modulos contidos aqui serão inicializados ao criar a aplicação
 */
const AppModules = [
    Serial,
]
// TODO: verificar para adicionar a possibilidade de cada modulo poder rodar em uma "thread"
export class App {
    private windows: BrowserWindow[];
    private appModules;
    private cleanupFunctions: Function[] = [];

    constructor() {
        console.log('app constructor');
        this.setExitCalls();
        this.windows = new Array<BrowserWindow>();
        this.appModules = [];
        for (let appModule of AppModules) {
            // let params = Reflect.getMetadata('design:paramtypes', appModule);
            // params.forEach((param: any) => {
            //     if (param === IpcMainService) {
            //         console.log('ipcMainService')
            //     }
            //     console.log('param', param);
            //     for (const key in this) {
            //         let thisAttribute;
            //         if (Array.isArray(this[key])) {
            //             thisAttribute = this[key]
            //         }
            //         if (this[key] instanceof param) {

            //         }
            //     }
            // })


            let appmd = Container.get(appModule);
            console.log(appmd);
            this.appModules.push(appmd);
        }
    }

    public addWindow(window: BrowserWindow) {
        this.windows.push(window);
    }

    public getMainWindow(): BrowserWindow {
        return this.windows[0];
    }

    public setExitCalls() {
        [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
            process.on(eventType, this.terminate.bind(this, eventType));
        })
    }

    public onTerminate(fn: () => void) {
        this.cleanupFunctions.push(fn);
    }

    public terminate(eventType?: string): void {
        console.log('Terminating app ', eventType);
        this.cleanupFunctions.forEach(fn => fn());
    }

}

export const usbNgElectronApp = new App();