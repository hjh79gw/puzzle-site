export interface ChallengeImageData {
  id: string;
  labelKey: string;
  src: string;
  category: string;
}

export const challengeImages: ChallengeImageData[] = [
  {
    id: 'sushi',
    labelKey: 'sushi',
    src: '/challenge/sushi-platter.jpg',
    category: 'food',
  },
  {
    id: 'balloon',
    labelKey: 'balloon',
    src: '/challenge/hot-air-balloons.jpg',
    category: 'travel',
  },
  {
    id: 'village',
    labelKey: 'village',
    src: '/challenge/colorful-buildings.jpg',
    category: 'landscape',
  },
  {
    id: 'coral',
    labelKey: 'coral',
    src: '/challenge/coral-reef.jpg',
    category: 'nature',
  },
  {
    id: 'candy',
    labelKey: 'candy',
    src: '/challenge/colorful-candy.jpg',
    category: 'food',
  },
];

export function getChallengeImage(imageId: string): ChallengeImageData | undefined {
  return challengeImages.find((img) => img.id === imageId);
}

export const challengeImageIds = challengeImages.map((img) => img.id);
