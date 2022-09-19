import { INotifier } from "./core";


export class NotifierImpl implements INotifier{

    private iconUrl?: string;
    private lastNotification: number;
    private delay: number;

    constructor(delay: number, iconUrl?: string){
        this.delay = delay;
        this.iconUrl = iconUrl;
        this.lastNotification = 0;
    }

    checkPeriod(): boolean{
        return (Date.now() - this.lastNotification) > (this.delay * 1000);
    }

    getDate(): number{
        return Math.floor(Date.now() / 1000);
    };

    notify_info(header: string, text: string): void{
        if(!this.checkPeriod()){
            return
        };

        AMOCRM.notifications.show_message_error(
            {
                header: header,
                text: text,
                date: this.getDate(),
                icon: this.iconUrl,
            }
        );
        this.lastNotification = Date.now();
    };

    notify_error(header: string, text: string): void{
        if(!this.checkPeriod()){
            return
        };

        AMOCRM.notifications.show_message_error(
            {
                header: header,
                text: text,
                date: this.getDate(),
                icon: this.iconUrl,
            }
        );
        this.lastNotification = Date.now();
    };
}


export class VoidNotifier implements INotifier{

    notify_info(header: string, text: string): void{};

    notify_error(header: string, text: string): void{};
}
