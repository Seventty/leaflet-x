export interface IModalOption {
    animation?: boolean
    ariaDescribedBy?: string
    ariaLabelledBy?: string
    backdrop?: boolean
    backdropClass?: string
    container?: string | HTMLElement
    keyboard?: boolean
    scrollable?: boolean
    size?: 'sm' | 'lg' | 'xl' | string
    windowClass?: string
    centered: boolean
    beforeDismiss?(): Promise<boolean> | boolean
}
