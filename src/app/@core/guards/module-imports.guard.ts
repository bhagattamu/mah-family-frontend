export function throwIfAlreadyLoaded(parentModule: any, coreModule: string) {
    if (parentModule) {
        throw new Error(`${coreModule} has already been loaded. Import Core modules in the AppModule only.`);
    }
}
