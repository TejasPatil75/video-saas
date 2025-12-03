export interface Video {
    id: string
    title: string
    description: string
    publicId: string
    originalSize: number
    compressedSize: number
    duration: number
    createdAt: Date | string
    updatedAt: Date | string
    userId: string // <--- Added ownership field
}