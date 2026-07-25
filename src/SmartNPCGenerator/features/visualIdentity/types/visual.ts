export type VisualStyle='fantasy-realism'|'dark-fantasy'|'classic-dnd-art'|'anime-fantasy'|'oil-painting'|'comic-style'|'character-sheet'|'vtt-token'|'cinematic';
export type CameraAngle='portrait'|'full-body'|'action-pose'|'side-profile'|'character-reference-sheet';
export type TokenShape='round'|'square';export type TokenFocus='face'|'full-body';
export interface NPCVisualProfile {readonly npcId:string;readonly portraitPrompt:string;readonly style:VisualStyle;readonly cameraAngle:CameraAngle;readonly lighting:string;readonly environment:string;readonly mood:string;readonly colorPalette:readonly string[];readonly characterPose:string;readonly equipmentVisible:readonly string[];readonly createdAt:string}
export interface VisualProfileInput {readonly style:VisualStyle;readonly cameraAngle:CameraAngle;readonly lighting:string;readonly environment:string;readonly mood:string;readonly colorPalette:readonly string[];readonly characterPose:string;readonly equipmentVisible:readonly string[]}
export interface TokenSettings {readonly shape:TokenShape;readonly transparentBackground:boolean;readonly focus:TokenFocus;readonly borderColor:string;readonly borderWidth:number;readonly size:number}
export interface ImageGenerationRequest {readonly profile:NPCVisualProfile;readonly negativePrompt:readonly string[];readonly width:number;readonly height:number}
export interface GeneratedImageResult {readonly blob:Blob;readonly mimeType:string;readonly providerId:string;readonly providerAssetId?:string}
export interface ImageProvider {readonly id:string;readonly name:string;generate(request:ImageGenerationRequest):Promise<GeneratedImageResult>}
export interface StoredNPCImage {readonly id:string;readonly npcId:string;readonly profile:NPCVisualProfile;readonly providerId:string;readonly providerAssetId?:string;readonly mimeType:string;readonly createdAt:string;readonly favorite:boolean;readonly active:boolean;readonly restoredFromId?:string}
export interface StoredImageWithData {readonly metadata:StoredNPCImage;readonly blob:Blob}
export interface VisualValidationIssue {readonly code:string;readonly message:string;readonly severity:'warning'|'error'}
export interface VisualValidationResult {readonly valid:boolean;readonly issues:readonly VisualValidationIssue[]}
export interface VisualEvidence {readonly apparentRace?:string;readonly apparentAge?:number;readonly clothing?:readonly string[];readonly equipment?:readonly string[];readonly environment?:string}
export interface PortraitGenerationResult {readonly profile:NPCVisualProfile;readonly validation:VisualValidationResult;readonly image:StoredImageWithData}
