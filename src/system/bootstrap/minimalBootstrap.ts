import { Container } from "typescript-ioc";
import { VoidNotifier } from "../../infrastructure/notifier/impl";


export function minimalBootstrap(): void {
    Container.bindName("INotifier").to(new VoidNotifier());
}
