export interface ActionResult {
  isDone: boolean;
  extractedContent?: string;
  error?: string;
  includeInMemory: boolean;
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

export interface TaskStatus {
  status: string;
}

export interface WebSocketEvents {
  'task:update': (taskId: string, result: ActionResult) => void;
  'task:complete': (taskId: string, results: ActionResult[]) => void;
}
