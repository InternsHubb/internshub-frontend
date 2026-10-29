// What the interviewer is doing; drives expression, gaze, head motion and the mouth.
// SPEAKING: asking a question · LISTENING: candidate answering · THINKING: answer being processed
// SUCCESS: interview finished · IDLE: anything else
export type AvatarState = 'IDLE' | 'SPEAKING' | 'LISTENING' | 'THINKING' | 'SUCCESS';
