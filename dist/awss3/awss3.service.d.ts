export declare class AwsS3Service {
    private bucketName;
    private s3;
    constructor();
    uploadFile(fileId: any, file: any): Promise<any>;
    getFileById(fileId: any): Promise<string | undefined>;
    deleteFileById(fileId: string): Promise<string>;
}
