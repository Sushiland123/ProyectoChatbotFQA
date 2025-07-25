// session.manager.ts
type SessionState = {
  waitingForContact?: boolean;
  failedAttempts?: number;
  lastFailedResponse?: string;
};

export class SessionManager {
  private sessions = new Map<string, SessionState>();

  get(sessionId: string): SessionState {
    return this.sessions.get(sessionId) || {};
  }

  set(sessionId: string, state: SessionState) {
    this.sessions.set(sessionId, state);
  }

  incrementFailedAttempts(sessionId: string, response: string) {
    const session = this.get(sessionId);
    session.failedAttempts = (session.failedAttempts || 0) + 1;
    session.lastFailedResponse = response;
    this.set(sessionId, session);
  }

  clear(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}

export const sessionManager = new SessionManager();
