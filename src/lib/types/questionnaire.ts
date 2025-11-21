export type QuestionType = 
  | 'text'
  | 'textarea'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'number'
  | 'email'
  | 'date'
  | 'rating';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
}

export interface Questionnaire {
  id: string;
  slug: string;
  title: string;
  description?: string;
  questions: Question[];
  settings: {
    allowAnonymous: boolean;
    showProgress: boolean;
    randomizeQuestions: boolean;
    timeLimit?: number; // in minutes
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionnaireResponse {
  id: string;
  questionnaireId: string;
  answers: Record<string, any>;
  submittedAt: Date;
  respondentId?: string;
}

export interface QuestionnaireBuilderState {
  questionnaire: Questionnaire;
  selectedQuestionId?: string;
  isPreviewMode: boolean;
}
