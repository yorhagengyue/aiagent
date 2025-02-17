export interface ActionResult {
  isDone: boolean;
  extractedContent?: string;
  error?: string;
  includeInMemory: boolean;
}

export interface PythonAgentOutput {
  is_done: boolean;
  extracted_content?: string;
  error?: string;
  include_in_memory: boolean;
}

export interface AgentBrain {
  pageSummary: string;
  evaluationPreviousGoal: string;
  memory: string;
  nextGoal: string;
}

export interface AgentHistoryList {
  allResults: ActionResult[];
  allModelOutputs: Record<string, any>[];
}
