export interface INotifier{
    notify_info(header: string, text: string): void;
    notify_error(header: string, text: string): void;
}
