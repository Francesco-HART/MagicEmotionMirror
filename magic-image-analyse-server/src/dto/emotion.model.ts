interface Emotion {
  emotionType: EmotionTypeEnum;
  emotionValue: number;
}

enum EmotionTypeEnum {
  'happy' = 'happy',
  'sad' = 'sad',
  'angry' = 'angry',
  'surprised' = 'surprised',
  'disgusted' = 'disgusted',
  'fearful' = 'fearful',
  'neutral' = 'neutral',
}

export { Emotion, EmotionTypeEnum };
